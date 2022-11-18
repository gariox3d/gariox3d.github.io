let nama, val;
const url_string = document.URL;
const url = new URL(url_string);
let friends;

if (url.searchParams.get('in') != null) {
  friends = url.searchParams.get('in');
} else {
  friends = "friends";
}

let footer = document.getElementById("credit");
footer.innerHTML = friends;
footer.href = "https://gariox-friend.garioxyt.repl.co/";

function time() {
  var d = new Date();
  var n = d.getHours();
  console.log(n);
  if (n >= 5 && n <= 10) {
    return "Morning"
  } else if (n >= 10 && n <= 15) {
    return "Afternoon"
  } else if (n >= 15 && n <= 18) {
    return "Evening"
  } else if (n >= 18 && n <= 24) {
    return "Night"
  }
}

function makan() {
  switch (time()) {
    case "Morning":
      return "breakfast"
      break;
    case "Afternoon":
      return "lunch"
      break;
    case "Evening":
      return "Lunch"
      break;
      case "Night":
      return "Dinner"
      break;
    default:
      break;
  }
}

function selesai() {
  const teks = document.getElementById('teks');
  const btn = document.querySelector('.tombol');
  teks.innerHTML = `For My ${friends} <i
  class="fas fa-heart text-danger animate__animated animate__heartBeat animate__repeat-3"></i>`;
  btn.classList.add('d-none');
  teks.classList.remove('d-none');  
}


document.querySelector(".tombol").addEventListener('click', function () {
  Swal.fire({
    title: 'Hello World!',
    html: `Good ${time()}, Have you ${makan()}?`,
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      Swal.fire('If not, dont forget to eat').then((result) => {
        Swal.fire({
          title: ' ',
          html: `I know you are very busy`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire({
              title: ' ',
              html: `Very dizzy, very tired`,
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire('Keep up the spirit, you :)').then((result) => {
                  Swal.fire(
                    'Dont stay up late!',
                    '',
                    'error'
                  ).then((result) => {
                    Swal.fire(
                      'Dont be late to eat!',
                      '',
                      'error'
                    ).then((result) => {
                      Swal.fire('I keep supporting you').then((result) => {
                        Swal.fire({
                          title: 'Oh yes I want to ask',
                          text: 'Is there something else you want?',
                          showDenyButton: true,
                          confirmButtonText: `Yes I want`,
                          denyButtonText: `No `,
                        }).then((result) => {
                          /* Read more about isConfirmed, isDenied below */
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: 'Want Anything?',
                              input: 'text',
                              inputPlaceholder: 'ex: Cofee, tea, or etc',
                              showCancelButton: false,
                              inputValidator: (value) => {
                                if (!value) {
                                  return 'Fill it first by'
                                }
                              }
                            }).then((result) => {
                              Swal.fire('Okey by', 'Then I will grant your wish', 'success').then((result) => {
                                Swal.fire(" See you! my Friend 🥰 ^^").then((result) => {
                                  selesai()
                                });
                              })
                            })
                          } else if (result.isDenied) {
                            Swal.fire('Oh okay if there isnt').then((result) => {
                              Swal.fire(" See you! my Friend 🥰 ^^").then((result) => {
                                selesai()
                              });
                            })
                          }
                        })
                      })
                    })
                  })
                })
              }
            })
          }
        })
      })
    }
  })
});
