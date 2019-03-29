async function routes(fastify, options) {
  const models = require('./../models');
  const fileUpload = require('./../fileUpload');
  const Multer = require('fastify-multer');

  const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
  });
  
  fastify.register(multer.contentParser);

  fastify.get('/', async (req, reply) => {
    reply.send({ hello: 'risman' });
  });

  fastify.route({
    method: 'POST',
    url: '/',
    preHandler: multer.single('file'), 
    handler: function(req, reply) {
      fileUpload.sendUploadToGCS(req, reply, (err) => {
        if (err) {
          return reply.send(err);
        }
        const data = models.File.build({
          fileName: req.file.cloudStoragePublicUrl
        });
        data.save().then(() => {
        reply.code(200).send(req.file.cloudStoragePublicUrl);
        console.log(req.file.cloudStoragePublicUrl);
        console.log(req.file.originalname);
        });
      })
    }
  });
};

module.exports = routes;