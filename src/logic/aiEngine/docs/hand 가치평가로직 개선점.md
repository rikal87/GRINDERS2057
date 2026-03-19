poker.js의 경우 두가지의 hand 평가 로직이 존재한다.
하나는 getHandCategory이고 다른 하나는 getSimpleHandCategory이다.


getHandCategory의 경우 넛 스테이트 체크 로직이 존재하기때문에
같은 플러시라도 자신의 위치를 좀더 정확하게 판단할수 있는 장점이있으나.

몇몇 케이스의 경우 보드를 고려안하고 무조건 랭크만으로 리턴하는 경우도 존재한다.

예시) 파켓 페어의 경우,
이경우에는 보드는 고려하지 않고 오직 자신이 탑투페어인지 아닌지만 체크함

if (isBoardPaired) {
      const isPocketPair = hand[0][0] === hand[1][0];
      // Overpair to the board pair (e.g. AA on KK86)
      if (isPocketPair && handRanks[0] > boardHigh1) return 'STRONG';

      // Counterfeited check
      if (!hasTopPair && handRanks.some(v => v < boardHigh1)) return 'MARGINAL';
      if (nutInfo.rank <= 15) return 'STRONG';
      return 'GOOD';
    }
    
넛 인포만 적극적으로 활용하여 자신의 패가 강도를 정확히 측정하는 식으로 변경하는 건 어떤가?
현재 nutInfo안에 보드 상황에 따라 예상랭크를 리턴함으로 보드텍스처를 추가로 읽어서 판단하는건
더블 카운트로 되지 않나?

