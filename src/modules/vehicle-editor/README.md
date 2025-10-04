# Vehicle Editor Module

Módulo isolado para edição de veículos com integração a APIs externas.

## Características

- **Totalmente isolado**: Não modifica componentes, páginas ou serviços existentes
- **Busca por SKU**: Lista e busca veículos facilmente
- **Wizard simplificado**: 5 etapas focadas nas informações essenciais
- **Step de Fornecedor**: Nova etapa para registrar dados do fornecedor e compra
- **Integração com APIs externas**: Conectado às APIs de autenticação e veículos

## Estrutura

```
src/modules/vehicle-editor/
├── components/
│   ├── SupplierStep.tsx          # Step de fornecedor
│   └── VehicleEditorSteps.tsx    # Steps simplificados
├── pages/
│   ├── VehicleEditorList.tsx     # Lista com busca por SKU
│   └── VehicleEditorWizard.tsx   # Wizard de edição/criação
├── services/
│   └── vehicleEditorApi.ts       # Serviço de API isolado
├── types.ts                       # Tipos do módulo
└── index.tsx                      # Exportações do módulo
```

## Rotas

- `/vehicle-editor` - Lista de veículos
- `/vehicle-editor/new` - Criar novo veículo
- `/vehicle-editor/edit/:id` - Editar veículo existente

## APIs

### Autenticação
- URL: `https://auth.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/auth`
- Endpoint: POST `/login`

### Veículos
- URL: `https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/vehicles`
- GET `/?page=1&limit=20` - Listar veículos
- GET `/sku/:sku` - Buscar por SKU
- GET `/:id` - Buscar por ID
- POST `/` - Criar veículo
- PUT `/:id` - Atualizar veículo
- DELETE `/:id` - Excluir veículo

## Etapas do Wizard

1. **Informações Básicas**: Categoria, subcategoria e título
2. **Chassi e Carroceria**: Fabricantes e modelos
3. **Dados do Veículo**: Ano, quilometragem, placa, etc.
4. **Localização**: Endereço completo
5. **Fornecedor**: Dados do fornecedor e informações de compra

## Step de Fornecedor

O step de fornecedor inclui:

- Nome do fornecedor (obrigatório)
- CNPJ (obrigatório)
- Pessoa de contato
- Email
- Telefone
- Endereço
- Data da compra
- Valor de compra
- Observações

## Uso

Para acessar o módulo, navegue para `/vehicle-editor` na aplicação.

O módulo funciona de forma independente e não interfere com as funcionalidades existentes de veículos.

## Armazenamento

- Token de autenticação: `localStorage.getItem('vehicle_editor_token')`
- Dados do usuário: `localStorage.getItem('vehicle_editor_user')`

## Desenvolvimento

Para adicionar novos steps ou funcionalidades:

1. Crie novos componentes em `components/`
2. Adicione ao array `STEPS` em `VehicleEditorWizard.tsx`
3. Atualize os tipos em `types.ts` se necessário
4. Não modifique arquivos fora do módulo `vehicle-editor/`
