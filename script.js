
const createElements = arr => {
  const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
  //console.log(htmlElements.join(' '));
   return htmlElements.join(" ");
};
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById('word-container').classList.add('hidden');
  }
  else {
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
}





const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(json => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lessons-btn")
  //console.log(lessonButtons);
  lessonButtons.forEach(btn => btn.classList.remove("active"));

}

const loadLevelWord = id => {
   manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const clickedBtn = document.getElementById(`lesson-btn-${id}`)
      //console.log(clickedBtn)
      removeActive() //remove all active class
      clickedBtn.classList.add("active");
      displayLevelWord(data.data)
    });
};
const displayLevelWord = words => {
  const wordContainer = document.getElementById('word-container');
  wordContainer.innerHTML = '';
  if (words.length === 0) {
    wordContainer.innerHTML = `
            <div class=" mt-5 bg-[#F8F8F8] rounded-xl w-11/12 mx-auto p-6 mb-4 border-2 ">
            <img class="mx-auto" src="assets/alert-error.png" alt="">
        <p class="font-bangla text-gray-400 font-semibold text-center m-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h4 class="font-bangla text-3xl font-semibold text-center mb-4">নেক্সট Lesson এ যান</h4>
      </div
    `;
    manageSpinner(false);
    return;
  }
  words.forEach(word => {
    const dynamicWordContainer = document.createElement('div');
    dynamicWordContainer.innerHTML = `
     
  <div class="card bg-base-100 w-30% h-10% shadow-sm ">
        <div class="card-body ">
          <div>
            <h2 class="card-title text-2xl font-bold">${word.word ? word.word : 'এই শব্দটি নেই'}</h2>
          </div>
          <div>
            <h4 class="text-1xl font-semibold">Meaning/Pronounciation</h4>
          </div>
          <div>
            <h3 class="font-bangla text-2xl">"${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} , ${word.pronunciation ? word.pronunciation : 'উচ্চারণের তথ্য নেই'}"</h3>
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center p-4 ">
            <button onClick="loadworddetail(${word.id})" class="bg-blue-100 hover:bg-blue-300 rounded-md p-2"><i class="fa-solid fa-clock"></i></button>
            <button class="bg-blue-100 hover:bg-blue-300 rounded-md p-2"><i class="fa-solid fa-bullhorn"></i></button>
          </div>
        </div>

    `;
    wordContainer.append(dynamicWordContainer);
  });
  manageSpinner(false);
};

const loadworddetail = async(id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`
 // console.log(url)
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
  //console.log(words);
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
  
        <div class="">
          <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone"></i>:${word.pronunciation})</h2>
         </div>

        <div class="">
          <h2 class="font-bold">Meaning</h2>
          <p>${word.meaning}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Example</h2>
          <p>${word.sentence}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Synonyms</h2>
          <div class="">${createElements(word.synonyms)}</div>

        </div>
        `;
   document.getElementById('word_modal').showModal();
}

const displayLesson = lessons => {
  // step-1 : Get the container & empty
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';
  // step-2 : Get into every lessons
  for (const lesson of lessons) {
    // step-3 : crete element
    const btnDiv = document.createElement('div');
    btnDiv.innerHTML = `
             <button id="lesson-btn-${lesson.level_no}" onClick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lessons-btn">
                <i class="fa-solid fa-book-open"></i>
                Lesson - ${lesson.level_no}
              </button>
              `;
    // step-4 : append into container
    levelContainer.append(btnDiv);
  }
};
loadLessons();



document.getElementById('btn-search').addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);


  fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
     displayLevelWord(filterWords)
    });
});
