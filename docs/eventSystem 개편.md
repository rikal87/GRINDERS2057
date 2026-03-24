eventSystem.js 에는 두가지 종류의 이벤트가 공존한다.

event.condition = 이벤트 트리거 조건(우선 검증)
event.repeatable =  true = 반복가능한 이벤트
event.repeatable = false = 한번만 트리거 가능한 이벤트
event.timer = 이벤트 트리거 타이머(발생조건 부터 검사, 조건이 만족하면, 타이머 실행, 0이 되면 이벤트 발생)

결론적으로 직접 호출하던, 스케쥴러에 의해서 발생하던 이벤트가 계속 발생하기 위해서는 event.repeatable = true 여야 한다.

timer 존재하고, repeatable = true 이면, 해당 이벤트가 발생하고 다시 트리거 대기열(store.pendingEvents)로 들어간다.
timer 존재하고, repeatable = false 이면, 이벤트가 1번만 발생가능하다.
condition, timer 존재, timer === 0, repeatable = true 이면, 조건 만족시 즉시 해당 이벤트가 발생한다.(추후 반복가능)
condition, timer 존재, timer === 0, repeatable = false 이면, 조건 만족시 즉시 해당 이벤트가 1번만 발생가능하다.
condition 만 존재 할경우 = 이벤트를 별도로 호출시, 조건 만족이 되면 즉시 실행 (1번만 실행가능)
condition, repeatable = true 면 이벤트를 별도로 호출시, 조건 만족시 즉시 실행 (추후 반복가능)

트리거 대기열(store.pendingEvents)은 동일한 이벤트는 최대 1개까지만 존재하도록 한다.(동일한 이벤트가 중복으로 등록되지 않도록)