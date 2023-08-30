const path = require('path');
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { RetrievalQAChain } = require('langchain/chains');
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter")
const { ContextualCompressionRetriever } = require("langchain/retrievers/contextual_compression");
const { LLMChainExtractor } = require("langchain/retrievers/document_compressors/chain_extract");
const { ConversationChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');
const { ConversationSummaryMemory } = require('langchain/memory');
const { OpenAI } = require('langchain/llms/openai');
const { S3Loader } = require('langchain/document_loaders/web/s3');
const { getFileLoader } = require('./documentLoader.js');

class OpenAiService {
  constructor () {
    this.model = new OpenAI({ temperature: 0 });

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
    // split docs into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    })
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(splitDocs.length)

    const baseCompressor = LLMChainExtractor.fromLLM(this.model);
    this.vectorStore = await HNSWLib.fromDocuments(splitDocs, new OpenAIEmbeddings());
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

  async ingestS3Files(data) {
    const { files } = data;
    
    const s3Config = {
      region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    }
    const unstructuredAPIURL = "http://localhost:8000/general/v0/general";
    const unstructuredAPIKey = process.env.UNSTRUCTURED_API_KEY;

    const docs = [];

    for (const fileKey of files) {
      const loader = new S3Loader({
        bucket: process.env.S3_BUCKET,
        key: fileKey,
        s3Config,
        unstructuredAPIURL,
        unstructuredAPIKey,
      });

      const fileData = await loader.load()
      docs.push(fileData);
    }
    console.log("docLength: ", docs.length);

    // split docs into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    })
    const allSplitDocs = [];
    for (const doc of docs) {
      const splitDocs = await textSplitter.splitDocuments(doc);
      allSplitDocs.push(...splitDocs);
    }

    const baseCompressor = LLMChainExtractor.fromLLM(this.model);
    this.vectorStore = await HNSWLib.fromDocuments(allSplitDocs, new OpenAIEmbeddings());
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
  
    // const { [responseType]: response } = await chain.call({
    //   [inputType]: userInput,
    // });
    const result = await chain.call({
      [inputType]: userInput,
    });

    // console.log(result);

   return { response: result.text };
  }
}

module.exports = {
    OpenAiService,
}