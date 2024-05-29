import { OpenAI } from "@langchain/openai"
import {
  getBaseClasses,
  getCredentialData,
  getCredentialParam
} from "../../../src/utils"
import { getModels, MODEL_TYPE } from "../../../src/modelLoader"

class AzureOpenAI_LLMs {
  constructor() {
    this.label = "Azure OpenAI"
    this.name = "azureOpenAI"
    this.version = 3.0
    this.type = "AzureOpenAI"
    this.icon = "Azure.svg"
    this.category = "Artificial Intelligence"
    this.description = "Wrapper around Azure OpenAI large language models"
    this.baseClasses = [this.type, ...getBaseClasses(OpenAI)]
    this.credential = {
      label: "Connect Credential",
      name: "credential",
      type: "credential",
      credentialNames: ["azureOpenAIApi"]
    }
    this.inputs = [
      {
        label: "Cache",
        name: "cache",
        type: "BaseCache",
        optional: true
      },
      {
        label: "Model Name",
        name: "modelName",
        type: "asyncOptions",
        loadMethod: "listModels",
        default: "text-davinci-003"
      },
      {
        label: "Temperature",
        name: "temperature",
        type: "number",
        step: 0.1,
        default: 0.9,
        optional: true
      },
      {
        label: "Max Tokens",
        name: "maxTokens",
        type: "number",
        step: 1,
        optional: true,
        additionalParams: true
      },
      {
        label: "Top Probability",
        name: "topP",
        type: "number",
        step: 0.1,
        optional: true,
        additionalParams: true
      },
      {
        label: "Best Of",
        name: "bestOf",
        type: "number",
        step: 1,
        optional: true,
        additionalParams: true
      },
      {
        label: "Frequency Penalty",
        name: "frequencyPenalty",
        type: "number",
        step: 0.1,
        optional: true,
        additionalParams: true
      },
      {
        label: "Presence Penalty",
        name: "presencePenalty",
        type: "number",
        step: 0.1,
        optional: true,
        additionalParams: true
      },
      {
        label: "Timeout",
        name: "timeout",
        type: "number",
        step: 1,
        optional: true,
        additionalParams: true
      }
    ]
  }

  //@ts-ignore
  loadMethods = {
    async listModels() {
      return await getModels(MODEL_TYPE.LLM, "azureOpenAI")
    }
  }

  async init(nodeData, _, options) {
    const temperature = nodeData.inputs?.temperature
    const modelName = nodeData.inputs?.modelName
    const maxTokens = nodeData.inputs?.maxTokens
    const topP = nodeData.inputs?.topP
    const frequencyPenalty = nodeData.inputs?.frequencyPenalty
    const presencePenalty = nodeData.inputs?.presencePenalty
    const timeout = nodeData.inputs?.timeout
    const bestOf = nodeData.inputs?.bestOf
    const streaming = nodeData.inputs?.streaming

    const credentialData = await getCredentialData(
      nodeData.credential ?? "",
      options
    )
    const azureOpenAIApiKey = getCredentialParam(
      "azureOpenAIApiKey",
      credentialData,
      nodeData
    )
    const azureOpenAIApiInstanceName = getCredentialParam(
      "azureOpenAIApiInstanceName",
      credentialData,
      nodeData
    )
    const azureOpenAIApiDeploymentName = getCredentialParam(
      "azureOpenAIApiDeploymentName",
      credentialData,
      nodeData
    )
    const azureOpenAIApiVersion = getCredentialParam(
      "azureOpenAIApiVersion",
      credentialData,
      nodeData
    )

    const cache = nodeData.inputs?.cache

    const obj = {
      temperature: parseFloat(temperature),
      modelName,
      azureOpenAIApiKey,
      azureOpenAIApiInstanceName,
      azureOpenAIApiDeploymentName,
      azureOpenAIApiVersion,
      streaming: streaming ?? true
    }

    if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
    if (topP) obj.topP = parseFloat(topP)
    if (frequencyPenalty) obj.frequencyPenalty = parseFloat(frequencyPenalty)
    if (presencePenalty) obj.presencePenalty = parseFloat(presencePenalty)
    if (timeout) obj.timeout = parseInt(timeout, 10)
    if (bestOf) obj.bestOf = parseInt(bestOf, 10)
    if (cache) obj.cache = cache

    const model = new OpenAI(obj)
    return model
  }
}

module.exports = { nodeClass: AzureOpenAI_LLMs }
