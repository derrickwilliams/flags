module.exports = function(options) {
  
  var
    self,
    s3 = options.s3,
    bucket = options.bucket,
    bucketKey = options.bucketKey,
    L = options.logger;
  
  self = {
    view: view,
    add: add,
    update: update,
    remove: remove,
    getAll: getAll,
    updateAll: updateAll,
    backup: backupFlagFile
  };

  return self;

  function view(name) {
    self.getAll(function(flags) {
      if (!(name in flags) && name !== 'all') {
        L('flag: ', name, 'does not exist.');
        process.exit();
      }

      if (name === 'all') {
        L(flags);
      }
      else {
        L('flag: ', name, 'value: ', flags[name]);  
      }
    });
  }

  function add(name, value) {
    if (value === undefined) {
      L('Flag value required.');
      process.exit();
    }

    self.backup(function() {
      self.getAll(function(flags) {
        if (name in flags) {
          L('Flag: ', name, 'already exists. Use update command.');
          process.exit();
        }

        flags[name] = value;
        self.updateAll(flags, function(response) {
          L('Add done.', response);
          process.exit();
        });
      });
    });
  }

  function update(name, value) {
    if (value === undefined) {
      L('Flag value required.');
      process.exit();
    }

    self.backup(function() {
      self.getAll(function(flags) {
        if (!(name in flags)) {
          L('Flag: ', name, 'does not exist. Adding.');
        }

        flags[name] = value;
        self.updateAll(flags, function(response) {
          L('Update done.', response);
          process.exit();
        });
      });
    });
  }

  function remove(name) {
    self.backup(function() {
      self.getAll(function(flags) {
        if (!(name in flags)) {
          L('Flag: ', name, 'does not exist. Doing nothing.');
          process.exit();
        }

        delete flags[name];
        self.updateAll(flags, function(response) {
          L('Delete done.', response);
          process.exit();
        });
      });
    });
  }

  function getAll(fn) {
    s3.getObject({ Bucket: bucket, Key: bucketKey }, function(err, response) {
      if (err) {
        L('error', err);
        throw err;
      }

      var flags = JSON.parse(response.Body.toString());
      fn(flags);
    });
  }

  function updateAll(flags, fn) {
    s3.putObject({
      Bucket: bucket,
      Key: bucketKey,
      Body: JSON.stringify(flags)
    }, function(err, response) {
      if (err) {
        L('Update err', err);
        throw err;
      }

      fn(response);
    });
  }

  function backupFlagFile(fn) {
    s3.copyObject({
      Bucket: bucket,
      Key: 'backups/' + bucketKey + '_' + new Date().getTime(),
      CopySource: bucket + '/' + bucketKey
    }, function(err, response) {
      if (err) {
        L('Copy error', err);
        throw err;
      }

      L('Copy done', response);
      fn(response);
    });
  }

};

