# WARN

Diretório `app/utils` foi migrado para a biblioteca [fvi-dynamoose-utils](https://console.aws.amazon.com/codesuite/codecommit/repositories/fvi-dynamoose-utils/browse?region=us-east-1).

# fvi-dynamoose-repository

-   `npm run compile`: Executa a limpeza dos arquivos e diretorios.
-   `npm run debug-test`: Executa os testes unitários com o DEBUG ativo.
-   `npm run test`: Executa os testes unitários.
-   `npm run debug-dev`: Executa os testes unitários e espera por alterações com o DEBUG ativo.
-   `npm run dev`: Executa os testes unitários e espera por alterçãoes.
-   `npm run prod`: Executa o código com NODE_ENV=production.
-   `npm run coverage`: Executa os testes unitários e retorna o [nyc](https://github.com/istanbuljs/nyc/)
-   `npm run release`: Inicia uma nova release de versão incrementando o **patch**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:minor`: Inicia uma nova release de versão incrementando o **minor**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:major`: Inicia uma nova release de versão incrementando o **major**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:finish`: Finaliza a release, ou seja, realiza o [git flow](https://github.com/nvie/gitflow/) release finish.

## FVI - Dynamoose Repository

Biblioteca que implementa funções utilitárias utilizando a biblioteca [dynamoose.js](https://github.com/dynamoosejs/dynamoose#README.md).

### Configuração

> Se invocarmos a função principal sem passar a configuração será usado o diretório ./config para buscar os arquivos de configuração, development.json, test.json, etc.

Esta biblioteca utiliza uma instância da biblioteca [node-convict.js](https://github.com/mozilla/node-convict), ou qualquer outra biblioteca de configurações que respeitar o contrato abaixo:

```javascript

config.get('prop1.prop2.prop3'): Object
config.has('prop1.prop2.prop3'): Boolean

```

> Exemplo de outra biblioteca que pode ser utilizada é [node-config.js](https://github.com/lorenwest/node-config)

Existe um contrato para as propriedades em um arquivo de configuração para o funcionamento correto deste módulo, devemos configurar as informações como o exemplo, _convict_, abaixo:

```json
{
    "dynamoose": {
        "accessKeyId": {
            "doc": "AWS Access Key ID",
            "format": String,
            "default": "fake-access-key",
            "env": "AWS_ACCESS_KEY_ID",
            "arg": "aws-access-key-id"
        },
        "secretAccessKey": {
            "doc": "AWS Secret Access Key",
            "format": String,
            "default": "fake-secret-key",
            "env": "AWS_SECRET_ACCESS_KEY",
            "arg": "aws-secret-access-key"
        },
        "region": {
            "doc": "AWS DynamoDB Region",
            "format": String,
            "default": "us-east-1",
            "env": "AWS_REGION",
            "arg": "aws-region"
        },
        "prefix": {
            "doc": "DynamoDB table prefix name.",
            "format": String,
            "default": "",
            "env": "DYNAMO_TABLE_PREFIX",
            "arg": "dynamo-table-prefix"
        },
        "suffix": {
            "doc": "DynamoDB table suffix name.",
            "format": String,
            "default": "",
            "env": "DYNAMO_TABLE_SUFFIX",
            "arg": "dynamo-table-suffix"
        },
        "dynalite": {
            "doc": "DynamoDB local with Dynalite!.",
            "format": Boolean,
            "default": false,
            "env": "DYNAMO_LOCAL_WITH_DYNALITE",
            "arg": "dynamo-local-with-dynalite"
        },
        "options": {
            "doc": "The dynamoose options.",
            "format": Object,
            "default": {}
        }
    }
}
```

### Mode de Usar

```javascript
const app = require('fvi-dynamoose-repository')

const repository = app(config)

const model = repository.map('Model Test 1', modelSchema, schemaOpts).get('Model Test 1')

model.save({ id: 1, nome: 'Test 1', documento: '123123123' })
```

### Repository Object

Executando a função principal exportada por este módulo recebemos um _Object_ para mapearmos modelos, ou tabelas, no dynamodb. Além de conseguir recuperar o modelo pelo nome utilizado no mapeamento. É utilizado o formato _String.slugify_, ex. _Model 1 2 tes t_ -> _model-1-2-tes-t_ no nome do modelo para evitarmos problemas de inconsistência no nome do modelo escolhido.

```javascript
const repository = app(config)

const repository = repository
    .map('model-1', model1schema, model1schemaOpts)
    .map('model-2', model2schema, model2schemaOpts)

const model1 = repository.get('model-1')
// const model1 = repository.get('Model 1')

const model2 = repository.get('model-2')
// const model2 = repository.get('mOdeL_2')
```

### Model Object

Quando criamos uma inst

-   **model.name**: Retorna a _string_ representando o nome do modelo sendo trabalhado.
-   **model.create({})**: Cria um novo registro na base de dados para este modelo, ou tabela.
-   **model.update({}, {})**: Atualiza um registro na base de dados para este modelo à partir da chave, ver chaves no DynamoDB.
-   **model.delete({})**: Deleta um registro na base de dados para este modelo à partir da chave, ver chaves no DynamoDB.
-   **model.get({})**: Recupera um registro da base de dados para este modelo através da chave, ver chaves no DynamoDB.
-   **model.query.equals({})**: Recupera os registros que respeitam os filtros passados como parâmetro para esta função no _Object_.
-   **model.scan.all()**: Retorna uma paginação da listagem completa de registros na base de dados para este modelo, ou tabela.
-   **model.query.from**: Retorna o _Object_ **Model.query** do [dynamoose]().
-   **model.scan.from**: Retorna o _Object_ **Model.scan** do [dynamoose]().

### Model Schema Object

-   [Dynamoose Schema](https://dynamoosejs.com/api/schema/)

### Model Schema Options Object

-   [Dynamoose Schema Options](https://dynamoosejs.com/api/schema/#options)

### Dynamosse Options

-   [Dynamoose Options](https://dynamoosejs.com/api/config/)
