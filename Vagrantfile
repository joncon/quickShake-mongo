# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  
  box = "centos6.4_base.box"
  config.vm.box = box
  config.vm.provider :virtualbox do |vb|
    vb.customize [ "modifyvm", :id, "--memory", 2048]  
    vb.customize [ "modifyvm", :id, "--ioapic", "on"]
  end
  
  #use nfs since default vagrant mount is sooba sloooooow. NFS requires static ip
  # NOTE: you must comment the following two lines out on when building box from scratch since nfs libraries are needed on guest machine.
  config.vm.synced_folder "./", "/vagrant/", :nfs => true
  unless ENV['OS'] =~ /NT/ then #Checks for 'Windows_NT' or 'CYGWIN_NT'
    config.vm.network :private_network, ip: "10.10.10.10"

    # do NOT download the iso file from a webserver
    # config.vbguest.no_remote = true
    # config.vbguest.auto_update = true
  end
  
  
  #port forwarding
  config.vm.network :forwarded_port, guest: 80, host: 3000

end