FROM node:6.0.0
MAINTAINER Sebastien Boson <sebastien.boson@heig-vd.ch> and Mathieu Urstein <mathieu.urstein@heig-vd.ch>

# import node-uuid library
COPY node_modules/node-uuid /opt/app/node_modules/node-uuid

# when we build the image, we copy all the javascript files in bin folder in the image file system
COPY bin /opt/app/bin

# entrypoint of the program
ENTRYPOINT ["node", "/opt/app/bin/musician.js"]
