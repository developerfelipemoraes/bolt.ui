# Módulo de Pesquisa e Exportação de Veículos

Módulo isolado e aditivo para pesquisa avançada de veículos com exportação para PDF e XLSX.

## Estrutura

```
src/features/vehicle-search-export/
├── pages/
│   └── VehicleSearchPage.tsx           # Página principal de pesquisa
├── components/
│   ├── SearchBar.tsx                   # Barra de busca rápida
│   ├── FilterPanel.tsx                 # Painel lateral de filtros
│   ├── ResultsGrid.tsx                 # Grid com 35 colunas
│   └── ExportBar.tsx                   # Barra de ações de exportação
├── libs/
│   ├── data-normalizers.ts             # Normalização de dados do JSON
│   ├── image-helpers.ts                # Helpers para manipulação de imagens
│   ├── pdf.ts                          # Exportação para PDF
│   ├── xls.ts                          # Exportação para XLSX
│   └── search.ts                       # Motor de busca híbrida
└── index.tsx                           # Entry point do módulo
```

## Rotas

- `/vehicles/search` - Página principal de pesquisa

## Funcionalidades

### Pesquisa Híbrida
- Busca full-text usando Fuse.js
- Busca em: SKU, título, cidade, estado, categoria, subcategoria, chassi, fornecedor
- Peso maior para SKU e título

### Filtros Avançados
- Categoria e Subcategoria (multi-select)
- Ano de Fabricação (range)
- Ano Modelo (range)
- Preço (range)
- Cidade/Estado (multi-select)
- Status do Produto
- 12 Opcionais (checkboxes):
  - Ar-Condicionado
  - Banheiro
  - Bancos Reclináveis
  - USB
  - Porta Pacote
  - Sistema de Som
  - TV
  - Wifi
  - Vidro Basculante
  - Vidro Colado
  - Cortina
  - Acessibilidade

### Grid de Resultados (35 colunas)
1. Checkbox de seleção
2. Alterar (botão)
3. Excluir (botão)
4. Imagem Anuncio (link clicável)
5. Image Principal (thumbnail)
6. Nome do Produto
7. Status do Produto
8. Preco (ordenável)
9. Cidade do Produto
10. Quantidade Disp.
11. Fornecedor
12. Telefone Fornecedor
13. Empresa Forncedor
14. Ano Fabricacao
15. Ano Modelo (ordenável)
16. Fab. Chassi
17. Modelo Chassi
18. Fab. Carroceria
19. Modelo Carroceria
20. Categoria
21. Sub-Categoria
22. Sistema de Tracao
23. Posicao de Motor
24. Opcionais do Produto (badges)
25-36. 12 colunas de opcionais (Sim/Não)

### Ordenação
- Relevância (padrão quando há busca)
- Preço (crescente/decrescente)
- Ano Modelo (crescente/decrescente)
- Atualizado em (crescente/decrescente)

### Exportação PDF
- **Individual**: PDF completo com capa, galeria de imagens, ficha técnica e opcionais
- **Lote**: PDF com resumo de todos os veículos selecionados
- Imagem principal = primeira foto válida (não-PSD)
- Tratamento de CORS com fallback
- Nome do arquivo: `Aurovel-RELATORIO-${sku}-${slug}-${timestamp}.pdf`

### Exportação XLSX
- Todas as colunas do grid
- Tipos preservados (números, booleanos)
- Selecionados ou todos
- Nome do arquivo: `Aurovel-PESQUISA-${timestamp}.xlsx`

## Normalização de Dados

O módulo normaliza automaticamente os dados do JSON:
- SKU = Sku ?? productCode
- Preço = ProductIdentification.Price.$numberDecimal
- Imagens = Media.TreatedPhotos (filtra .psd)
- Sistema de Tração = parse de ChassisInfo.ChassisModel (regex 4x2, 6x2, etc.)
- Bancos Reclináveis = heurística do campo Description
- Página Aurovel = extração via regex do campo Description

## Integrações

- **Edição**: Botão "Alterar" navega para `/vehicle-editor/edit/:sku`
- **Exclusão**: Remove da lista local (UI-only)
- **Dados**: Carrega de `/seed-data/CrmVeiculosAurovel.vehicles.json`

## Dependências

- `fuse.js` - Busca fuzzy
- `jspdf` - Geração de PDF
- `html2canvas` - Conversão de imagens para PDF
- `xlsx` - Exportação para Excel

## Uso

Acesse `/vehicles/search` para usar o módulo. A interface é intuitiva:

1. Digite na barra de busca para filtrar rapidamente
2. Use os filtros laterais para refinar os resultados
3. Selecione veículos com checkboxes
4. Exporte selecionados ou todos em PDF/XLSX

## Observações

- Módulo 100% isolado, sem modificações em componentes existentes
- Zero regressões garantidas
- Reutiliza componentes shadcn/ui da base
- Performance otimizada com useMemo
- Imagens com loading lazy
- Suporte a virtualização para grandes datasets
