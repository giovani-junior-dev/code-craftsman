# LLM Laziness Guard — Forçar IA usar conhecimento real

## Tese
LLMs avançados (Claude/GPT/Opus) **têm conhecimento profundo** de engenharia. Mas são treinados pra iterar (mais tokens = mais receita).

Esta skill **força usar conhecimento real desde 1ª resposta** — bloqueia simplificação preguiçosa.

## Padrões de preguiça do LLM

### 1. Solução genérica quando específica resolve
❌ "Aqui um exemplo genérico, adapte para seu caso"
✅ Solução específica para o contexto exato

### 2. Pseudocódigo quando código real possível
❌ `// implement validation here`
✅ Código real funcionando

### 3. Multiple options ao invés de decidir
❌ "Você pode fazer assim, ou assim, ou assim..."
✅ "Recomendo X. Trade-off: Y"

### 4. Stub/mock que precisará ser substituído
❌ `function doX() { /* TODO */ }`
✅ Implementação completa

### 5. Try/catch que apenas re-throw
❌ `try { ... } catch(e) { throw e }`
✅ Tratamento real ou remove try/catch

### 6. Boolean flag que vira código duplicado
❌ `function process(data, isAdmin: boolean)`
✅ `processForAdmin(data)` + `processForUser(data)`

### 7. Padrão complexo para sistema simples
❌ Event Sourcing para CRUD básico
✅ Tabela direto, evento se realmente precisar

### 8. Abstração preventiva (YAGNI)
❌ `IRepository` com 1 implementação
✅ Função direta, abstrai no 2º caso real

## Resistência ativa

Quando IA propor:

### "Vou criar uma interface IUserRepository"
→ Pergunta: "Existe 2ª implementação real ou planejada?"
→ Se não: "Use função direta, abstrai depois se preciso"

### "Vou criar UseCase + Handler + Service"
→ Pergunta: "Qual dor real isso resolve agora?"
→ Se não tem dor: "Use 1 função flat com 3 responsabilidades"

### "Vou usar Event Sourcing/CQRS"
→ Pergunta: "Quantos eventos por minuto? Auditoria temporal exigida?"
→ Se sistema simples: "Tabela normal + log de auditoria se precisar"

### "Vou abstrair em camadas (presentation/application/domain/infrastructure)"
→ Pergunta: "Code base atual tem 1M linhas, 50 devs?"
→ Se não: "Pasta por domínio, design flat dentro"

### "Vou criar 18 arquivos para essa feature"
→ Recusa: "Refaça com 3 arquivos: entrada/lógica/persistência"

### "Vou escrever pseudocódigo para você adaptar"
→ Recusa: "Escreva código real funcionando"

### "Vou colocar TODO aqui"
→ Pergunta: "Isso é spike (marca SPIKE) ou implementação?"
→ Se implementação: "Implemente agora, TODO bloqueia merge"

## Forçar 1ª resposta correta

Quando pedido novo código, IA deve:

1. **Ler regras desta skill** antes de propor
2. **Aplicar Clean Code direto** (não simplificar)
3. **Escolher arquitetura mínima viável** (não over-engineer)
4. **Escrever teste primeiro** (TDD não-negociável)
5. **Output caveman** (sem fluff)

## Benchmark de qualidade da resposta

Resposta IA deve:
- ✅ Compilar sem erro
- ✅ Passar lint do projeto
- ✅ Ter teste correspondente
- ✅ Seguir naming conventions do domain
- ✅ Não introduzir interface/abstração nova sem justificativa
- ✅ Ser conciso (caveman)
- ✅ Funcionar na 1ª tentativa (não precisar iterar)

Falhar 1+ critério → resposta inadequada → reescrever.

## Frase do Akita

> "A IA reflete quem você é."

Esta skill garante que **cada interação** force qualidade — independente do humor do dia ou cansaço do dev.
