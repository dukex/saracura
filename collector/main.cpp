#include "collectorservice.h"

int
main(int argc, char **argv)
{
    Collector daemon(argc, argv);
	return (daemon.exec());
}

// vim: set ts=4 sw=4 et autoindent cindent:
