# cpx
## Description
This repository is the home of the CPX project. It's like a private tracker, but made by me (and perhaps you!), so it's different and, I have to say, way better!<br />
  
This project has as goal to create a complete but simple website based on clean code. No dirty hacks at all, we promise!

## File Structure
CPX relies on a subdomain system. That's why the root of the project contains only directories and the main config file.<br />
 * <code>www</code> contains all dynamic files that are used by the user to access the data he wants, generally <code>.torrent</code> files.
 * <code>static</code> contains all static data (pictures, StyleSheets, ...) that the dynamic files rely on to ensure the website is displayed correctly. These files should be hosted on a basic webserver as PHP is not needed for these files.
 * <code>tracker</code> contains all the files related to the website's tracker. Basically, it's an implementation of the Bittorrent protocol so that torrent clients can meet each other.
 * <code>database</code> contains the launcher of the datanase. This is where database files will be generated, but not added to repo as they are too big. The host of the database must **NOT** be accessible from the web, but only from the servers hosting the tracker and the main website!
<br />
The file <code>config.json</code> contains all basic data the tracker and the website need in order to run correctly. If you setup CPX on multiple machines, you must copy this on the tracker and website server's webroot parent directory

## Disclaimer
This project should not be used for piracy. We do this only to discover how the system works!

## Licence
This project is distributed under the MIT license. You can read a copy of it in the file <code>LICENSE</code>.
