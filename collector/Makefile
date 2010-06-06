#
#	$Id$

# qt config
export QTDIR?=/usr
QMAKE=${QTDIR}/bin/qmake

COLLECTOR_SRCS=./*.cpp
COLLECTOR_HDRS=./*.h
TWITAPI_SRCS=twitterapi/*.cpp
TWITAPI_HRDS=twitterapi/*.h 

PROG=saracurad
TARGET=${PROG}

all: ${TARGET} build

QMAKEFILE=${PROG}.makefile
QMAKEPRO=${PROG}.pro

.PHONY: ${PROG}
${PROG}: ${QMAKEFILE}
	${MAKE} -f $<

.PHONY: install distribution
distribution install: build
	@echo "installing binaries..."
	@-for i in ${PROG} ${PROG}.sh; do \
		[ -e $${i} ] && \
		echo "proceeding $${i}..."; \
		install -m 755 ./$${i} ${DESTDIR}/bin/$${i}; \
	done
	@echo "done"

.PHONY: build
build: ${PROG}
	@true

${PROG}-release: ${PROG}
	strip --strip-unneeded ${PROG} -o $@

${QMAKEFILE}: ${QMAKEPRO}
	${QMAKE} -makefile \
		$< \
		"TARGET=${PROG}" \
		"INCLUDEPATH+=../corelib/" \
		"OBJECTS_DIR=./.objs" \
		"MOC_DIR=./.mocs" \
		"CONFIG += release" \
		"QT += network" \
		"QT += sql" \
		"QT += xml" \
		"QT -= gui" \
		-o $@

#"LIBS+=-l3dimg -L${LIB3DIMGDIR}" \

${QMAKEPRO}: Makefile
	${QMAKE} -project \
		-nopwd \
		-norecursive \
		${COLLECTOR_SRCS} \
		${COLLECTOR_HDRS} \
		${TWITAPI_SRCS} \
		${TWITAPI_HRDS} \
		-o $@
	@echo "include(qtservice/qtservice.pri)" >> $@

# updates the ignore list on repo
.PHONY: ignoreup
ignoreup: .cvsignore
	svn propset svn:ignore -F $< .

.PHONY: distclean
distclean: clean prunebuild
	-[ -d .objs ] && \
		rmdir .objs
	-[ -d .mocs ] && \
		rmdir .mocs

.PHONY: clean
clean:
	-[ -e ${QMAKEFILE} ] && \
		${MAKE} -f ${QMAKEFILE} clean
	-rm -fv ${PROG}-release
	-rm -fv ${PROG}

.PHONY: prunebuild
prunebuild:
	-[ -e ${QMAKEFILE} ] && \
		rm -fv ${QMAKEFILE}
	-[ -e ${QMAKEPRO} ] && \
		rm -fv ${QMAKEPRO}

# vim: set tw=78:
