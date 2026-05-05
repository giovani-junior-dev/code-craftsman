# Anti-padrões — O que BLOQUEAR

## Naming
- ❌ Classes genéricas: `Manager`, `Processor`, `Handler`, `Util`, `Helper`, `Service` (sem domínio)
- ❌ Prefixos: `IRepository`, `m_var`, `_private`
- ❌ Notação Húngara
- ❌ Sufixos redundantes: `NameString`, `UserData`, `OrderInfo`
- ❌ Letras soltas: `d`, `tmp`, `obj` fora de loop curto

## Funções
- ❌ Boolean flag parameter: `doX(flag: true)` — indica 2 funções
- ❌ Output args: modificar entrada — usar return
- ❌ 3+ parâmetros sem encapsular em objeto
- ❌ Função >20 linhas
- ❌ Indentação >2 níveis (deep nesting)

## Arquitetura
- ❌ Interface sem 2ª implementação real
- ❌ UseCase para CRUD simples
- ❌ DTO/Mapper em 3+ camadas sem dor real
- ❌ Inversão de dependência preventiva
- ❌ Import cruzado entre domínios (`billing/` importa `orders/`)
- ❌ Clean Architecture ritualística (use cases, ports, adapters sem necessidade)
- ❌ Eventourcing/CQRS para CRUD simples

## Testes
- ❌ Código produção SEM teste prévio (verifica git timestamp)
- ❌ Múltiplos asserts não relacionados num teste
- ❌ `if`/`switch` dentro de teste
- ❌ `.only`/`.skip` em commit
- ❌ Mock excessivo (>3 mocks num teste)
- ❌ Snapshot externo >50 linhas
- ❌ Teste depois do código (timely violation)
- ❌ Teste acoplado à implementação (mockando demais)

## Comentários
- ❌ Código comentado (deletar — git guarda)
- ❌ Comentário redundante (explica O QUÊ visível)
- ❌ Histórico de mudanças (git já faz)
- ❌ Comentário sem WHY (motivação)
- ❌ Comentários falsos/desatualizados

## Geral
- ❌ Números mágicos (sem constante nomeada)
- ❌ Switch grande (>3 cases) sem polimorfismo
- ❌ Lei de Demeter: `a.b().c().d()`
- ❌ Duplicação (DRY)
- ❌ Dead code (Knip detecta)
- ❌ Console.log em produção
- ❌ TODO sem issue number
- ❌ Catch sem tratar erro (silencioso)
- ❌ Promise sem await sem motivo

## LLM-specific (vibe coding)
- ❌ Nomes inventados sem domain match
- ❌ Padrões super complexos (event sourcing) para sistema simples
- ❌ Solução genérica quando específica resolve
- ❌ Múltiplas "soluções" ao invés de escolher 1
- ❌ Pseudo-código quando código real é possível
- ❌ Comentário tipo "// Add error handling here" sem implementar
- ❌ Try/catch que apenas re-throw
