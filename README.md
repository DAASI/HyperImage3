# Setting up HyperImage Development Envoirnment

The following steps are required to setup HI development envoirnment:
1. Download eclipse IDE
1. Setup Maven on eclipse
1. Checkout Hyperimage project from this GIT repsitory. This will create following maven projects:
    1. hi3-authorenv
    1. hi3-editor
    1. hi3-manager
    1. hi3-parent
    1. hi3-reader
    1. HIImage
1. Create new glassfish server (only tested with Glass Fish version 4.1.2) in eclipse IDE. By default eclipse IDE does not have glassfish server, please follow the link https://stackoverflow.com/questions/25200410/how-to-configure-glassfish-server-in-eclipse-manually to create and start new glassfish server.
1. Run maven "clean package" on hi3-parent. This will compile the code and will create necessary components including manager applet, editor applet, and reader-base.zip. Finally it will add everything in war HI3-Author.war, created in hi3-authorenv/target folder.
1. We can now deploy the project by accessing admin console of local server using credetenials username "admin" and password "test". And deploying the war created in previous step.
1. Following steps need to be done in order to configure Postgresql database with HyperImage:
    1. Go to Glassfish adminconsole by hitting url http://localhost:4848
    1. Create new connection pool by going to Resources > JDBC > JDBC Connection Pools, and click "New" button.
    1. Set pool name "HIEditor_ORM_PostgreSQLPool"
    1. Select Resource Type "javax.sql.DataSource"
    1. Select Database Driver Vendor "Postgresql"
    1. Set the following additional properties:
    <table>
        <tr>
            <th>Name</th><th>Value</th>
        </tr>
        <tr>
            <td>ServerName</td><td>NAME OF SERVER WHERE YOUR DATABASE IS INSTALLED</td>
        </tr>
        <tr>
            <td>PortNumber</td><td>PORT NUMBER WHERE DATABASE IS RUNNING</td>
        </tr>
        <tr>
            <td>DatabaseName</td><td>YOUR DATABASE NAME</td>
        </tr>
        <tr>
            <td>User</td><td>DATABASE USER</td>
        </tr>
        <tr>
            <td>Password</td><td>YOUR DATABASE PASSWORD</td>
        </tr>
     </table>
    1. Create a new JNDI Resource by going to Resources > JDBC > JDBC Resources, and click "New button"
    1. Enter JNDI name "jdbc/HIEditorORM"
    1. Select newly created pool, i-e "HIEditor_ORM_PostgreSQLPool"
    1. Click "OK" button
1. Run the server from eclipse IDE or from admin console.
1. HIImage should be accessbile at http://localhost:8080/HI3Author/

Before accessing the instance of HyperImage, make sure database server is up and running.

Enjoy using HyperImage :)

-------------------------------------------------------------

All rights reserved. Use is subject to terms of the Apache License, Version 2.0.
See the included LICENSE file or http://www.apache.org/licenses/LICENSE-2.0.html for license details.

HyperImage 3 is currently under development (Beta state). The functionality and the function volume of the system
can change until it is finalised.
