# TWA — Ficha 05 (Componentes, Formulários, Lifecycle e Composables)

## O que está feito
- **Divisão em componentes (`props` down, `emits` up):**
  - `src/components/ItemList.vue`: recebe `items` e `selectedId` via `defineProps` e emite o evento `select` com o `id` do videojogo clicado através de `defineEmits(['select'])`.
  - `src/components/ItemDetail.vue`: recebe o objeto `item` selecionado por prop e apresenta todos os seus detalhes (nome, categoria, preço, `developer` e `tags`).
  - `src/components/ItemForm.vue`: mantém um rascunho local reativo (`reactive`), recebe `cats` por prop, usa `v-model.trim` e `v-model.number`, valida os campos em tempo real com propriedades `computed` (`errors` e `isValid`), emite o evento `save` no `@submit.prevent` e limpa o formulário após submissão.
- **Composable `useLoad` (`src/composables/useLoad.js`):**
  - Extração da gestão dos três estados (`loading`, `error`, `ready`) e do ciclo de vida `onMounted(load)` para um composable reutilizável em conjunto com `src/api/getJSON.js`.
- **Reação a alterações com `watch`:**
  - Uso de `watch(query, () => { selectedId.value = null })` no `App.vue` para limpar a seleção atual sempre que o utilizador altera o texto de pesquisa.
- **Testes unitários:**
  - Verificação das funções de catálogo em `check.js` com os dados do meu `public/items.json`.

## Declaração de uso de IA
- Foi utilizada a ferramenta Google Gemini como apoio em casa para estruturar a divisão do `App.vue` nos componentes `ItemList`, `ItemDetail` e `ItemForm`, rever a implementação do composable `useLoad` e redigir este ficheiro `README.md`.

## Perguntas de Reflexão

1. **Porque é que as `props` são apenas de leitura (*read-only*) no componente filho e usamos `emit` para comunicar alterações ao pai?**
   - Para garantir um fluxo de dados unidirecional (*data down, events up*), onde apenas o componente pai (`App.vue`) é dono do estado. Se vários componentes filhos pudessem modificar diretamente o array de itens recebido por prop (`props.items.push(...)`), seria difícil rastrear quem alterou o estado e as alterações perder-se-iam quando o pai recarregasse os dados. Ao emitir um evento (`emit`), o filho apenas notifica o que aconteceu e o pai decide como atualizar o seu estado.

2. **Qual a diferença entre `computed` e `watch`? Quando se deve usar cada um?**
   - Um `computed` serve para derivar um novo valor a partir do estado existente de forma pura, síncrona e com *cache* (por exemplo, a lista `visible`, as categorias `cats` ou o estado `isValid` do formulário), sem efeitos secundários. Já o `watch` serve para executar um efeito secundário (*side effect*) em reação à mudança de uma fonte reativa — como limpar outra `ref` (`selectedId.value = null` quando `query` muda), guardar dados no `localStorage` ou disparar um novo pedido à API.

3. **Qual a vantagem de extrair a lógica de carregamento para o composable `useLoad`?**
   - Evita repetir as mesmas variáveis reativas (`status`, `error`, `data`), o bloco `try / catch` e o `onMounted` em todos os ecrãs da aplicação. Cada componente que chama `useLoad(fetcher)` recebe a sua própria instância independente de `ref`s, mantendo o código do componente limpo e focado na sua lógica específica. 