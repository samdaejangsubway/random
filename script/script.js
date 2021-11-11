// 랜덤 함수
function getRandomInt(min, max) {
  const random = Math.random();
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random * (max - min + 1)) + min;
}

// 역 정보 그룹화
function getStationInfo() {
  const group = {};
  const stationData = subwayInfo;
  const data = stationData.reduce((acc, cur) => {
    const { station_nm, line_num } = cur;

    if (!acc[line_num]) {
      acc[line_num] = { data: [station_nm] };
    } else {
      acc[line_num].data.push(station_nm);
    }
    return acc;
  }, {});
  return data;
}

// 오디오 객체 생성
function createAudio(src, isLoop) {
  const audio = new Audio();
  audio.src = src;
  audio.loop = isLoop;
  return audio;
}

// DOM elements
var btn_Line = document.querySelector("#lineBtn");
var btn_Station = document.querySelector("#stationBtn");
var btn_start = document.querySelector("#startBtn");
var btn_refresh = document.querySelector("#refreshBtn");

var startImg = document.querySelector("#startImg");
var lineImg = document.querySelector("#lineImg");
var stationImg = document.querySelector("#stationImg");
var refreshImg = document.querySelector("#refreshImg");

var p_lineNum = document.querySelector("#lineNum");
var p_lineCircle = document.querySelector("#line-circle");
var div_circleBox = document.querySelector("#circle-box");
var div_stationInfo = document.querySelector("#stationInfo");
var div_wrapper = document.querySelector("#wrapper");

var p_stationName = document.querySelector("#stationWrapper");
var span_stationName = document.querySelector("#stationName");

var div_lineContainer = document.querySelector(".line-container");
var line_slideBox = document.querySelector("#line-slideBox");
var station_slideBox = document.querySelector("#station-slideBox");

// json data
var station_info = getStationInfo();

// store
var lineNum, station;
var start_flag, line_flag;

// audio
var slotAudio = createAudio("./audio/slot.mp3", true);
var selectAudio = createAudio("./audio/select.mp3", false);
var completeAudio = createAudio("./audio/complete.mp3", false);

// event listener
btn_start.addEventListener("click", () => {
  slotAudio.play(); // 슬롯 효과음 시작

  // 몇호선 선택 애니메이션 시작
  p_lineNum.className = "hidden";
  div_lineContainer.classList.remove("hidden");
  start_flag = true;

  btn_start.disabled = true;
  startImg.classList.add("disable-on");
});

btn_Line.addEventListener("click", () => {
  if (!start_flag) {
   alert("시작 버튼을 먼저 눌러주세요!");
   return;
  }
  
  slotAudio.pause(); // 슬롯 효과음 정지
  slotAudio.currentTime = 8;
  selectAudio.play();
  slotAudio.play(); // 슬롯 효과음 다시 시작
  line_flag = true;

  lineNum = getRandomInt(1, 9); // 1호선~9호선
  p_lineNum.className = ""; // 몇호선인지 표시
  p_lineNum.innerHTML = `${lineNum}호선`;
  p_lineCircle.innerHTML = lineNum;
  div_circleBox.className = `color-${lineNum}`;
  div_wrapper.className = `color-${lineNum}`;
  line_slideBox.className += " hidden";

  const data = station_info[lineNum]?.data;
  const stationTpl = data.reduce((acc, cur) => {
    const data = "<li>" + cur + "역</li>";
    acc += data;
    return acc;
  }, ``);
  station_slideBox.classList.remove("hidden");
  station_slideBox.innerHTML = "<ul class='slide-box slide-station'>" + stationTpl + "</ul>";
  p_stationName.className += " hidden";

  btn_Line.disabled = true; // 호선 선택 버튼 disable
  lineImg.classList.add("disable-on");
});

btn_Station.addEventListener("click", () => {
  if (!start_flag) {
    alert("시작 버튼을 먼저 눌러주세요!");
    return;
  }
  if (!line_flag) {
    alert("몇호선 버튼을 먼저 눌러주세요!");
    return;
  }
  
  slotAudio.pause(); // 슬롯 효과음 정지
  completeAudio.play();

  const length = station_info[lineNum]?.data.length;
  const randNum = getRandomInt(0, length - 1); // 1호선~9호선
  station = station_info[lineNum]?.data[randNum];
  p_stationName.className = "";
  span_stationName.innerHTML = `${station}역`;
  span_stationName.classList.add("station-animated");

  station_slideBox.className += " hidden";
  stationImg.classList.add("disable-on");
  btn_Station.disabled = true; // 역 선택 버튼 disable
});

btn_refresh.addEventListener("click", () => {
  window.location.reload(true);
});
