# lizchang

This is a simple Node.js / MongoDB app that powers my wife's [design portfolio](http://lizchangdesign.com). There are different ways to set this up. You could run it off of the `data.json` file directly, or you could set it up to use MongoDB. I've done the latter, so I will run through the basics of how to do that here.

## Server Setup

### Basics

The site runs on two Digital Ocean linux droplets. The first server is for the application itself, and the second is for the Mongo database. Detailed setup for Ubuntu servers at Digital Ocean is covered on their site, but the general idea is:

* Add two droplets and add a new ssh key in control panel
* Create new root password for your servers
* Copy the ssh public key to your servers with the following command:
```bash
cat ~/.ssh/id_rsa.pub | ssh root@YOUR_SERVER_IP "cat >> ~/.ssh/authorized_keys"
```
* Create new users for your application and database servers
* You may need to add the ssh key to your new user:
```bash
cat ~/.ssh/id_rsa.pub | ssh YOUR_USER@YOUR_SERVER_IP "mkdir -p ~/.ssh && cat >>  ~/.ssh/authorized_keys"
```

At this point you should be able to log into your database server:
```bash
ssh YOUR_USER@YOUR_SERVER_IP
```

Open the mongo config:
```bash
nano /etc/mongod.conf
```

Change the bind ip to allow for external connections:
```bash
bind_ip = 0.0.0.0
```

Assuming you have the mongodb client installed, create a general database collection for the site:
```bash
mongoimport --host YOUR_SERVER_IP --port 27017 --db YOUR_DB_NAME --collection site --drop --file data-mongo-site.json
```

Create a database collection for the design projects:
```bash
mongoimport --host YOUR_SERVER_IP --port 27017 --db YOUR_DB_NAME --collection projects --drop --file data-mongo-projects.json
```

Test your database by trying to connect remotely:
```bash
mongo --host YOUR_SERVER_IP
> use YOUR_DB_NAME
switched to db YOUR_DB_NAME
> db.projects.find()
```

### Adding a Firewall

For security purposes you should do a few things to lock down your database server. The bare minimum would be to set up a firewall and limit connections.

https://www.digitalocean.com/community/tutorials/how-to-use-the-mongodb-one-click-application

```bash
sudo apt-get install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow from ip.address.to.allow
sudo ufw enable
```

## App Setup

The app itself is a simple Node.js app using Express. There are just a few things worth pointing out.

### Configuration

The app configuration is handled by an NPM module called [nconf](https://github.com/indexzero/nconf). Nconf allows for hierarchical configuration merges. So in this case there is a config on the server and a default config for running locally, which you can see in `nconf_setup.js`.

### Templating

Hogan is used as the templating engine.

### Data Access

Since this is not a high traffic website, data access is very straightforward.  We use the mongodb client to connect to our external database server and query the data.
