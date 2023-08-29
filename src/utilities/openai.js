const path = require('path');
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { RetrievalQAChain } = require('langchain/chains');
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { ContextualCompressionRetriever } = require("langchain/retrievers/contextual_compression");
const { LLMChainExtractor } = require("langchain/retrievers/document_compressors/chain_extract");
const { ConversationChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');
const { ConversationSummaryMemory } = require('langchain/memory');
const { OpenAI } = require('langchain/llms/openai');
const { getFileLoader } = require('./documentLoader.js');

class OpenAiService {
  constructor () {
    this.model = new OpenAI({ temperature: 0, verbose: true });

    this.prompt = PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    Relevant pieces of previous conversation:
    {history}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    Human: {input}
    AI:`);

    this.memory = new ConversationSummaryMemory({ llm: this.model, returnMessages: true });
    this.vectorStore;
    this.retriever;
    this.chain;
  }

  assembleChain () {
    if (this.chain) return { chain: this.chain, inputType: 'query', responseType: 'text' };

    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.prompt,
      llm: this.model,
    });
    return { chain, inputType: 'input', responseType: 'response' };
  }

  async ingestFile(data) {
    const { files } = data;
    const originalname = files.originalname;
    const filepath = files.path;
    const fileExtension = path.extname(originalname);
    
    const loader = getFileLoader(fileExtension, filepath);
    if (!loader) {
      throw Error('bad');
    }

    const docs = await loader.load();

    const baseCompressor = LLMChainExtractor.fromLLM(this.model);
    this.vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    this.retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: this.vectorStore.asRetriever(),
    });

    this.chain = RetrievalQAChain.fromLLM(
      this.model, 
      this.retriever, 
      { returnSourceDocuments: true }
    );
    return { success: true };
  }

  call = async (userInput) => {  
    const { chain, inputType, responseType } = this.assembleChain();
  
    const { [responseType]: response } = await chain.call({
      [inputType]: userInput,
    });

   return { response };
  }
}

module.exports = {
    OpenAiService,
}