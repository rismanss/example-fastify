const fastify = require('fastify')();

fastify.register(require('fastify-formbody'));
fastify.register(require('./router'), {prefix: '/'});

fastify.listen(3000, function(err, address) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});