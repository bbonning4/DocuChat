// const {OpenAIEmbeddings} = require('langchain/embeddings/openai')
// const {RecursiveCharacterTextSplitter} = require('langchain/text_splitter')
// const {OpenAI} = require('langchain/llms/openai')
// const {loadQAStuffChain} = require('langchain/chains')
// const {Document} = require('langchain/document')

// const timeout = 60000;
// const indexName = 'docuchat-pinecone-index'

// const createPineconeIndex = async (
//     client,
//     indexName,
//     vectorDimension,
// ) => {
//     console.log(`Checking "${indexName}"...`);
//     const existingIndexes = await client.listIndexes();
//     if (!existingIndexes.includes(indexName)) {
//         console.log(`Creating "${indexName}"...`);
//         await client.createIndex({
//             createRequest: {
//                 name: indexName,
//                 dimension: vectorDimension,
//                 metric: 'cosine',
//             },
//         });
//         console.log(`Creating index... please wait for it to finish initializing.`);
//         await new Promise((resolve) => setTimeout(resolve, timeout));
//     } else {
//         console.log(`"${indexName}" already exists.`);
//     }
// }

// const updatePinecone = async (client, indexName, docs) => {
//     const index = client.Index(indexName);
//     console.log(`Pinecone index retrieved: ${indexName}`);
//     if (!Array.isArray(docs)) {
//         docs = [docs];
//     }
//     for (const doc of docs) {
//         console.log(`Processing document: ${doc.metadata.source}`);
//         const txtPath = doc.metadata.source;
//         const text = doc.pageContent;
//         const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 1000,
//         });
//         console.log('Splitting text into chunks...');
//         const chunks = await textSplitter.createDocuments([text]);
//         console.log(`Text split into ${chunks.length} chunks`);
//         console.log(`Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks...`);
//         const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
//             chunks.map((chunks) => chunks.pageContent.replace(/\n/g, " "))
//         );
//         console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`)
//     };
    
//     const batchSize = 100;
//     let batch = []
//     for (let idx = 0; idx < chunks.length; idx++) {
//         const chunk = chunks[idx];
//         const vector = {
//             id: `${txtPath}_${idx}`,
//             values: embeddingsArrays[idx],
//             metadata: {
//                 ...chunk.metadata,
//                 loc: JSON.stringify(chunk.metadata.loc),
//                 pageContent: chunk.pageContent,
//                 txtPath: txtPath,
//             },
//         };
//         batch = [...batch, vector];
//         if (batch.length === batchSize || idx === chunks.length - 1) {
//             await index.upsert({
//                 upsertRequest: {
//                     vectors: batch,
//                 },
//             });
//             batch = []
//         }
//     }
// }

// const queryPineconeVectorStoreAndQueryLLM = async (
//     client,
//     indexName,
//     question
// ) => {
//     console.log('Querying Pinecone vector store...');
//     const index = client.Index(indexName);
//     const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
//     let queryResponse = await index.query({
//         queryRequest: {
//             topK: 10,
//             vector: queryEmbedding,
//             includeMetadata: true,
//             includeValues: true,
//         },
//     });
//     console.log(`Found ${queryResponse.matches.length} matches...`);
//     console.log(`Asking question: ${question}...`);
//     if (queryResponse.matches.length) {
//         // create OpenAI instance and load QAStuffChain
//         const llm = new OpenAI({
//             model: 'gpt-3.5-turbo',
//         });
//         const chain = loadQAStuffChain(llm);
//         const concatenatedPageContent = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");
//         const result = await chain.call({
//             input_documents: [new Document({ pageContent: concatenatedPageContent })],
//             question: question,
//         });
//         console.log(`Answer: ${result.text}`);
//         return result.text;
//     } else {
//         console.log('Since there are no matches, GPT will not be queried.');
//     }
// }

// module.exports = {
//     createPineconeIndex,
//     updatePinecone,
//     queryPineconeVectorStoreAndQueryLLM,
//     indexName,
// }
