let currentImageIndex = loadImageIndex();
const image = document.getElementById("image");
const todoItems = document.querySelectorAll(".todo-item");
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


// ==================== 초기화 ====================

// 초기화 시 todo 불러오기, 달력 할 일 불러오기, 달력에서 todo로 이동, 이미지 설정, enter 등록, 달력 렌더링
window.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  loadTodayTasks();
  initializeImages();
  setTodoInput();
  renderCalendar();
});

// 로컬 스토리지에서 할 일 목록 불러오기
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  for (const todoText of todos) {
    addTodoToDOM(todoText);
  }
}

// 달력에서 오늘 일자 할 일 todo로 보내기
function loadTodayTasks() {
  if (calendarData[todayString]) {
    calendarData[todayString].forEach(task => {
      addTodoToDOM(task);
    });

    delete calendarData[todayString];
    saveCalendarData();
    saveTodos();
    renderCalendar();
  }
}

// 이미지 세팅
function initializeImages() {
  const defaultImages = [
      { name: "기본 사진 A", grade: "C", src: "images/Cdefault.jpg" },
      { name: "기본 사진 B", grade: "C", src: "images/Cdefault2.jpg" },
      { name: "기본 사진 C", grade: "C", src: "images/Cdefault3.jpg" },
  ];

  images = JSON.parse(localStorage.getItem("drawnImages")) || [];
  defaultImages.forEach(defaultImage => {
      const isDuplicate = images.some(photo => photo.src === defaultImage.src);
      if (!isDuplicate) {
          images.push(defaultImage);
      }
  });

  localStorage.setItem("drawnImages", JSON.stringify(images));
  image.src = images[currentImageIndex].src;
}

// 입력 후 enter로 버튼 작동
function setTodoInput() {
  const todoInput = document.getElementById('todo-input');
  todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  });

  const calendarTaskInput = document.getElementById('calendar-input');
    calendarTaskInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addCalendarTask();
      }
    });
}

// ==================== 이미지 관리 ====================

// 로컬 스토리지에서 이미지 인덱스 불러오기&저장
function loadImageIndex() {
  const savedIndex = localStorage.getItem("currentImageIndex");
  return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
}
function saveImageIndex(index) {
  localStorage.setItem("currentImageIndex", index);
}

// 이미지 전환 함수
function updateImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;

  if (images.length > 0 && images[currentImageIndex]) {
    image.src = images[currentImageIndex].src;
    saveImageIndex(currentImageIndex);
  }
}

// 할 일 항목 변경될 때 이미지 업뎃
todoItems.forEach(item => {
  item.addEventListener("change", updateImage);
});


// ==================== 할 일 목록 ====================

// 로컬 스토리지에 할 일 목록 저장
function saveTodos() {
  const todos = [];
  const todoList = document.getElementById('todo-list').children;
  for (const item of todoList) {
    todos.push(item.querySelector('span').textContent); 
  }
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 새 할 일 추가
function addTodo() {
  const todoInput = document.getElementById('todo-input');
  const todoText = todoInput.value.trim(); // 공백 제거

  if (todoText === '') {
    alert('할 일을 입력해주세요!');
    return;
  }
  addTodoToDOM(todoText);
  saveTodos();
  todoInput.value = ''; // 입력 필드 초기화
}

// 변수 증가 및 저장
function incrementCounter() {
  const counterKey = "completedTaskCounter";
  let counter = parseInt(localStorage.getItem(counterKey), 10) || 0;
  counter += 1;
  localStorage.setItem(counterKey, counter);
  return counter;
}

// DOM에 새 할 일 항목 추가
function addTodoToDOM(todoText) {
  const todoList = document.getElementById('todo-list');
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  const textSpan = document.createElement('span');
  textSpan.contentEditable = true;
  textSpan.textContent = todoText;
  textSpan.onblur = saveTodos;

  // 완료 버튼
  const completeButton = document.createElement('button');
  completeButton.addEventListener("click", updateImage);
  completeButton.textContent = '완료';
  completeButton.className = 'completed';

  completeButton.onclick = function () {
    listItem.classList.add('completed');
  
    if (!calendarCompleteData[todayString]) {
      calendarCompleteData[todayString] = [];
    }calendarCompleteData[todayString].push(todoText);

    todoList.removeChild(listItem);

    incrementCounter();
    saveCalendarData();
    updateCalendarCompletedTaskList();
    saveTodos();
    renderCalendar();
  };
  
  listItem.appendChild(textSpan);
  listItem.appendChild(completeButton);

  // 미루기
  const postponeButton = document.createElement('button');
  postponeButton.textContent = '미루기';
  postponeButton.className = 'postponed';
  
  postponeButton.onclick = function () {
    // 선택한 날짜 설정
    let targetDate = selectedDate ? new Date(selectedDate) : null;

    // 선택된 날짜가 없거나, 있지만 오늘을 포함해 이전이라면 내일로 설정
    if (!targetDate || targetDate <= today) {
      targetDate = new Date();
      targetDate.setDate(today.getDate() + 1);
    }
    targetDate = targetDate.toISOString().split('T')[0];

    // 선택한 날짜의 할 일 목록으로 todo 항목 이동
    if (!calendarData[targetDate]) {
      calendarData[targetDate] = [];
    }
    calendarData[targetDate].push(todoText);
    todoList.removeChild(listItem);

    saveCalendarData();
    updateCalendarTaskList();
    saveTodos();
    renderCalendar();
    };

    listItem.appendChild(postponeButton);
  
  // 삭제
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✖';
  deleteButton.className = 'deleted';

  deleteButton.onclick = function () {
    todoList.removeChild(listItem);
    saveTodos();
  };

  listItem.appendChild(deleteButton);
  todoList.appendChild(listItem);
}

// ==================== 달력 ====================
const calendarData = JSON.parse(localStorage.getItem('calendarData')) || {};
const calendarCompleteData = JSON.parse(localStorage.getItem('calendarCompleteData')) || {};
let selectedDate = null;
let currentDate = new Date();

// 달력 데이터 저장
function saveCalendarData() {
  localStorage.setItem('calendarData', JSON.stringify(calendarData));
  localStorage.setItem('calendarCompleteData', JSON.stringify(calendarCompleteData));
}

// 달력 렌더링
function renderCalendar() {
  const { year, month, firstDay, daysInMonth, daysInPrevMonth } = renderDaysForCurrentMonth();
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  renderPreviousMonthDays(firstDay, daysInPrevMonth, calendar);
  renderCurrentMonthDays(daysInMonth, year, month, calendar);
  renderNextMonthDays(calendar.childNodes.length, calendar);

  const currentMonthLabel = document.getElementById('current-month');
  currentMonthLabel.textContent = `${year}년 ${currentDate.toLocaleString('ko-KR', { month: 'long' })}`;
}

// 이번 달 날짜 가져오기
function renderDaysForCurrentMonth() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  return { year, month, firstDay, daysInMonth, daysInPrevMonth };
}

// 이전 달 렌더링
function renderPreviousMonthDays(firstDay, daysInPrevMonth, calendar) {
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDiv = createDayDiv(daysInPrevMonth - i, 'other-month');
    dayDiv.onclick = () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
      selectDate(parseInt(dayDiv.textContent));
    };
    calendar.appendChild(dayDiv);
  }
}

// 이번 달 렌더링
function renderCurrentMonthDays(daysInMonth, year, month, calendar) {
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = createDayDiv(day, 'day');
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    applyDayStyles(dayDiv, dateString, year, month, day);
    dayDiv.onclick = () => selectDate(day);
    calendar.appendChild(dayDiv);
  }
}

// 이후 달 렌더링
function renderNextMonthDays(existingDays, calendar) {
  const remainingDays = 42 - existingDays;
  for (let i = 1; i <= remainingDays; i++) {
    const dayDiv = createDayDiv(i, 'other-month');
    dayDiv.onclick = () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
      selectDate(parseInt(dayDiv.textContent));
    };
    calendar.appendChild(dayDiv);
  }
}

function createDayDiv(day, className) {
  const dayDiv = document.createElement('div');
  dayDiv.textContent = day;
  dayDiv.className = `day ${className}`;
  return dayDiv;
}

// 달력 일자별 스타일 추가
function applyDayStyles(dayDiv, dateString, year, month, day) {
  const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  if (isToday) dayDiv.classList.add('today');
  if (calendarData[dateString]) dayDiv.classList.add('has-task');
  if (calendarCompleteData[dateString]) dayDiv.classList.add('has-task-completed');

  const dayOfWeek = new Date(year, month, day).getDay();
  if (dayOfWeek === 0) dayDiv.classList.add('weekend');
}

// 날짜 선택
function selectDate(day) {
  const days = document.querySelectorAll('.day');
  days.forEach(dayDiv => dayDiv.classList.remove('selected'));

  const selectedDayDiv = Array.from(days).find(dayDiv => dayDiv.textContent == day && !dayDiv.classList.contains('other-month'));
  if (selectedDayDiv) {
    selectedDayDiv.classList.add('selected');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateCalendarTaskList();
    updateCalendarCompletedTaskList();
  }
}

// 달바꿈(<, >)
function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
}

// ==================== 달력 할 일 목록 ====================
// 선택된 날의 할 일 추가하기
function addCalendarTask() {
  if (!selectedDate) {
    alert('날짜를 먼저 선택하세요.');
    return;
  }

  const calendarTaskInput = document.getElementById('calendar-input');
  const task = calendarTaskInput.value.trim();
  if (task) {
    if (!calendarData[selectedDate]) {
      calendarData[selectedDate] = [];
    }
    calendarData[selectedDate].push(task);
    calendarTaskInput.value = '';

    updateCalendarTaskList();
    updateCalendarCompletedTaskList();
    saveCalendarData();
    renderCalendar();
  }
}

// 선택된 날의 할 일 업데이트
function updateCalendarTaskList() {
  const calendarTaskList = document.getElementById('calendar-task-list');
  calendarTaskList.innerHTML = '';

  if (calendarData[selectedDate]) {
    calendarData[selectedDate].forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task;

      const moveButton = document.createElement('button');
      moveButton.textContent = '이동';
      moveButton.onclick = () => {
        addTodoToDOM(task); 
        calendarData[selectedDate].splice(index, 1); 
        if (calendarData[selectedDate].length === 0) {
          delete calendarData[selectedDate];
        }
        updateCalendarTaskList();
        saveCalendarData();
        saveTodos();
        renderCalendar();
      };

      const deleteButton = createDeleteButton(calendarData, index, 'calendar-task-list', () => updateCalendarTaskList());

      li.appendChild(moveButton);
      li.appendChild(deleteButton);

      calendarTaskList.appendChild(li);
    });
  }
}

// 선택된 날의 완료된 일 업데이트
function updateCalendarCompletedTaskList() {
  const calendarTaskList = document.getElementById('calendar-completed-task-list');
  calendarTaskList.innerHTML = '';

  if (calendarCompleteData[selectedDate]) {
    calendarCompleteData[selectedDate].forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task;

      const deleteButton = createDeleteButton(calendarCompleteData, index, 'calendar-completed-task-list', () => updateCalendarCompletedTaskList());

      li.appendChild(deleteButton);
      calendarTaskList.appendChild(li);
    });
  }
}

// 삭제 버튼 생성 함수
function createDeleteButton(taskData, index, taskListId, additionalUpdateFunction) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✖';
  deleteButton.onclick = () => {
    taskData[selectedDate].splice(index, 1);
    if (taskData[selectedDate].length === 0) {
      delete taskData[selectedDate];
    }
    if (additionalUpdateFunction) {
      additionalUpdateFunction();
    }
    saveCalendarData();
    renderCalendar();
  };
  return deleteButton;
}