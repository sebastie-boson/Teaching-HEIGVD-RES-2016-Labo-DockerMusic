FROM node:6.0.0
MAINTAINER Sebastien Boson <sebastien.boson@heig-vd.ch> and Mathieu Urstein <mathieu.urstein@heig-vd.ch>

# when we build the image, we copy all the javascript files in bin folder in the image file system
COPY bin /opt/app/bin

#
EXPOSE 2205

#
ENTRYPOINT ["node", "/opt/app/bin/auditor.js"]
