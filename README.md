# Setting up HyperImage Development Envoirnment

The following steps are required to setup HI development envoirnment:
1. Download eclipse IDE
1. Setup Maven on eclipse
1. Checkout Hyperimage project from the this GIT repsitory. This will create following maven projects:
    1. hi3-authorenv
    1. hi3-editor
    1. hi3-manager
    1. hi3-parent
    1. hi3-reader
    1. HIImage
1. Create new glassfish server (only tested with Glass Fish version 4.1.2) in eclipse IDE. By default eclipse IDE does not have glassfish server, please follow the link https://stackoverflow.com/questions/25200410/how-to-configure-glassfish-server-in-eclipse-manually to create and start new glassfish server.
1. Run maven "clean package" on hi3-parent. This will compile the code and will create necessary components including manager applet, editor applet, and reader-base.zip. Finally it will add everything in war HI3-Author.war, created in hi3-authorenv/target folder.
1. We can now deploy the project by accessing admin console of local server using credetenials username "admin" and password "test". And deploying the war created in previous step.
1. Server configurations also needs to be done for the deployment. Right now we are using all configurations of hyperimage.rir.prj server including the database instance and configurations. 
1. Run the server from eclipse IDE or from admin console.
1. HIImage should be accessbile at http://localhost:8080/HI3Author/

As local server is using database instance of hyperimage.rir.prj machine, so hyperimage.rir.prj machine must be turned on before acessing HI application running on local.

-------------------------------------------------------------

All rights reserved. Use is subject to terms of the Apache License, Version 2.0.
See the included LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html for license details.

HyperImage 3 is currently under development (Beta state). The functionality and the function volume of the system
can change until it is finalised.
