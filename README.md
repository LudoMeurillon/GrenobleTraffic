#Google App Engine Java ClickStart

<a href="https://grandcentral.cloudbees.com/?CB_clickstart=https://raw.github.com/CloudBees-community/google-app-engine-java-clickstart/master/clickstart.json">Deploy this to Google App Engine via CloudBees DEV@Cloud</a>

This is a simple Java application which is deployed to Google App Engine. Be aware of the following caveats:

* This ClickStart assumes you've authorized your DEV@Cloud Jenkins to deploy to Google App Engine by visiting https://appengine.cloudbees.com

* The tries to deploy to the application ID you provide when creating the ClickStart. If this fails, you can edit the job and click "Advanced" in the "Deploy Java Application to Google App Engine". Jenkins will then prompt you to create the application ID on Google App Engine, or you can change the application ID to one that already exists.