const { MODEL_STORES, enabledModel } = require('./model-store-constants.js');

class ChatService {
  constructor () {
    this.modelService = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const userInput = data.body;
    const response = await this.modelService.call(userInput);
    return response;
  }

  async ingestFile(data) {
    return this.modelService.ingestFile(data);
  }

  async ingestS3Files(data) {
    return this.modelService.ingestS3Files(data);
  }
}

module.exports = {
    ChatService,
};