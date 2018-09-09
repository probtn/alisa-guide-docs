// Для асинхронной работы используется пакет micro.
const { json } = require('micro');

var Az = require('az');
  
  var morph_init = false;
  Az.Morph.init(function() {
    morph_init = true;
  });

  // Запуск асинхронного сервиса.
  module.exports = async req => {

    // Из запроса извлекаются свойства request, session и version.
    const { request, session, version } = await json(req);

    
    var text = "";
    console.log("request", request);
    if (!request.command) {
      text = "Привет! Это помошник для сервиса viewst.com. Что бы ты хотел узнать?"
    } else {
      try {
      var word = null;
      if (morph_init) {
        var parses = Az.Morph(request.command.toString().toLowerCase(), 
          { forceParse: true, typos: "auto", ignoreCase: true });
        word = parses[0].normalize(true).word;
        console.log("parse2", word);
      } }catch(ex) {
        console.log(ex);
      }
      if (!word) {
        word = request.command.toLowerCase();
      }
      switch (word) {
        case "описать":
        case "описал":
        case "описание":
          text = "Viewst - это креатив и система управления нового поколения мобильной рекламы"
          break;
        case "интегрировать": 
        case "интеграция":
          text = "Интеграция возможна напрямую, посредством добавления кода на страницы сайта, так и через сторонние рекламные системы (DSP, SSP)."
          break;
        default:
          text = "Извините, я не поняла запрос."
          break;
      }
    }

    // В тело ответа вставляются свойства version и session из запроса.
    // Подробнее о формате запроса и ответа — в разделе Протокол работы навыка.
    return {
      version,
      session,
      response: {

        // В свойстве response.text возвращается исходная реплика пользователя.
        // Если навык был активирован без дополнительной команды,
        // пользователю нужно сказать "Hello!".
        text: text,

        // Свойство response.end_session возвращается со значением false,
        // чтобы диалог не завершался.
        end_session: false,
      },
    };

  };



