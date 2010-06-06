#ifndef COLLECTOR_H
#define COLLECTOR_H

#include <QObject>
#include "QtService"

#include "twitterapi/twitterapi.h"

class CollectorPrivate;
class QTimerEvent;

class Collector : public QObject, public QtService<QCoreApplication>
{
    Q_OBJECT
public:
    Collector(int argc, char **argv);
    ~Collector() { };

    void start();

private slots:
    void entries(EntryList);
    void requestDone(int);
    void unauthorized(const QString &status, quint64 inReplyToId );
    void errorMessage(const QString &message);
    void timerEvent();
    void processEntry(Entry entry);

private:
    CollectorPrivate *d;
};

#endif //! COLLECTOR_H
// vim: set ts=4 sw=4 et autoindent cindent:
