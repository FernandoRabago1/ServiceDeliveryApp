const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL });

exports.indexService = async (service) => {
  await client.index({
    index: 'services',
    id: service.service_id,
    document: {
      description: service.description,
      category: service.category,
      pricing_model: service.pricing_model,
    },
  });
};

exports.search = async (term) => {
  const { hits } = await client.search({
    index: 'services',
    query: {
      multi_match: {
        query: term,
        fields: ['description', 'category', 'pricing_model'],
      },
    },
  });
  return hits.hits.map(hit => hit._source);
};
