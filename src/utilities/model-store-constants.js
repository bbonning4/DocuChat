const { HuggingFaceService } = require('./huggingface.js');
const { OpenAiService } = require('./openai.js');

const MODEL_STORES = {
    'HUGGING_FACE': HuggingFaceService,
    'OPEN_AI': OpenAiService,
};

const { ENABLED_MODEL_STORE } = process.env;
const DEFAULT_ENABLED_MODEL_STORE = 'OPEN_AI';

const enabledModel = ENABLED_MODEL_STORE || DEFAULT_ENABLED_MODEL_STORE;

module.exports = {
    MODEL_STORES,
    ENABLED_MODEL_STORE,
    DEFAULT_ENABLED_MODEL_STORE,
    enabledModel,
}