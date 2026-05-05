# Clean Code — Regras Mensuráveis (Robert C. Martin)

## Nomenclatura
- Revelar intenção: `elapsedTimeInDays`, não `d`
- Sem ruído: `Name`, não `NameString`/`NameInfo`
- Sem prefixo `I` em interface, sem `m_`, sem Notação Húngara
- Substantivos em classes/objetos (`Customer`, `Account`)
- Verbos em métodos (`postPayment`, `deletePage`)
- Padrão getter/setter: `get*`, `set*`, `is*`
- Nome longo = escopo longo
- Letras soltas só em loop muito curto

## Funções
- ≤20 linhas
- Indentação ≤2 níveis
- 0/1/2 parâmetros (3+ → encapsular em objeto)
- 1 coisa só (SRP)
- Sem flag boolean (indica 2 funções)
- Sem output args (modificar entrada confunde)

## Comentários
- Não compensam código ruim — limpar código primeiro
- Bons: legal, intent, warning, TODO
- Ruins: redundante, histórico, **código comentado** (deletar)
- Regra do agente: WHY > WHAT (motivação > o que faz)

## Formatação
- Arquivos ~200 linhas (max 500)
- Top-down: alto nível → detalhe (jornal)
- Linhas ≤120 chars
- Variável local antes do uso
- Variáveis instância no topo da classe
- Chamador acima do chamado

## Classes
- Tamanho = nº responsabilidades (não linhas)
- Descritível em ~25 palavras sem "se/e/ou/mas"
- ≤7 variáveis instância
- Alta coesão — cada método usa muitas variáveis
- DIP — depende de abstração

## Testes (TDD + F.I.R.S.T)

### 3 Leis TDD
1. Não escrever código produção sem teste falhando
2. Não escrever mais teste que necessário para falhar
3. Não escrever mais código que necessário para passar

### F.I.R.S.T
- **F**ast — <100ms unit
- **I**ndependent — ordem aleatória passa
- **R**epeatable — qualquer ambiente
- **S**elf-validating — boolean
- **T**imely — antes do código produção

### Rules
- 1 assert/teste, 1 conceito/teste
- Naming: `should_X_when_Y`

## Tratamento de Erros
- Exceções > códigos retorno
- Não retorna null → coleção vazia ou Special Case
- Não passa null como argumento

## Code Smells
- **G5 DRY:** duplicação = inimigo principal
- **G14 Feature Envy:** método acessa dados de outro objeto repetidamente
- **G23 Switch:** >3 cases sem polimorfismo
- **G25 Magic Numbers:** sem constante nomeada
- **G28 Boolean:** encapsular em método (`shouldBeDeleted(timer)`)
- **G36 Lei de Demeter:** sem `a.b().c().d()` (Shy Code)
