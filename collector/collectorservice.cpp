#include <QSettings>
#include <QDebug>
#include <QTimer>
#include <QProcess>
#include <QRegExp>

#include "collectorservice.h"

class CollectorPrivate
{
public:
    CollectorPrivate();
    TwitterAPI *twitterapi;
    QSettings *settings;
    QString recipient;

    void insertEvent(const QString &, const QString &);
};

CollectorPrivate::CollectorPrivate() :
    twitterapi(new TwitterAPI)
{
    settings = new QSettings("./saracura.conf", QSettings::NativeFormat);
    recipient = settings->value("saracura/recipient").toString();
}

void
CollectorPrivate::insertEvent(const QString &text, const QString &url) 
{
#if 0
    QProcess mail;

    qWarning() << "sending mail";
    mail.start("sendmail", QStringList() << "-F" << "truiterbot" <<
               recipient);
    mail.waitForStarted();

    mail.write("To: ");
    mail.write(recipient.toAscii());
    mail.write("\n");
    mail.write("subject: ");
    mail.write(text.toAscii());
    mail.write("\n\n");
    if (url != QString::null) {
        mail.write(url.toAscii());
        mail.write("\n");
    }
    mail.write(".\n\n");
    mail.closeWriteChannel();
    (void)mail.readAll();
    mail.waitForFinished();
    qWarning() << "mail sent at:";
    QProcess::execute("date");
#endif
}

Collector::Collector(int argc, char **argv) :
    QObject(),
    QtService<QCoreApplication>(argc, argv, "Saracura Collector Service"),
    d(new CollectorPrivate)
{
}

void
Collector::processEntry(Entry entry)
{
    qWarning() << "id: " << entry.id;
    QString text = entry.text;

    qWarning() << "full message: " << text;
    QString link = QString::null;
    QRegExp rx("((https?|ftp):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\.&]*)");
    if (rx.indexIn(text) > 0) {
        text.truncate(text.indexOf("<a href"));
        link = rx.cap(1);
        qWarning() << "link:" << link;
    }
    qWarning() << "text:" << text;
    d->insertEvent(text, link);
}

void
Collector::entries(EntryList list)
{ 
    qWarning() << __FUNCTION__ << "()";

    if (! list.empty())
        foreach (Entry entry, list) {
            processEntry(entry);
	    qWarning() << "deleting" << entry.id;
            d->twitterapi->deleteDM(entry.id);
        }
    QTimer::singleShot(35000, this, SLOT(timerEvent()));
}

void
Collector::start()
{
    connect(d->twitterapi, SIGNAL(newEntries(EntryList)), SLOT(entries(EntryList)));
    connect(d->twitterapi, SIGNAL(unauthorized( QString, quint64 )),
                SLOT(unauthorized( QString, quint64 )));
    connect(d->twitterapi, SIGNAL(errorMessage(QString)), SLOT(errorMessage(QString))) ;

    QTimer::singleShot(5000, this, SLOT(timerEvent()));
}

void
Collector::requestDone(int role)
{
    qWarning() << __FUNCTION__ << "()";
    qWarning() << "role: " << role;
}

void
Collector::unauthorized(const QString &status, quint64 inReplyToId )
{
    qWarning() << __FUNCTION__ << "()";
    qWarning() << status << endl
        << "code: " << inReplyToId;
}

void 
Collector::errorMessage(const QString &message)
{
    qWarning() << __FUNCTION__ << "()";
    qWarning() << "error message: " << message;
}

void
Collector::timerEvent()//QTimerEvent *e)
{
    QProcess::execute("date");
    d->twitterapi->setServiceUrl("http://twitter.com/");

    QString login = d->settings->value("saracura/user").toString();
    QString pass = d->settings->value("saracura/pass").toString();
    d->twitterapi->setLogin(login);
    d->twitterapi->setPassword(pass);

    d->twitterapi->directMessages();
}

// vim: set ts=4 sw=4 et autoindent cindent:
