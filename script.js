document.addEventListener('DOMContentLoaded', function() {
    var toolbarOptions = [
      ['bold', 'italic'], // Botões de negrito e itálico
      [{
        'list': 'ordered'
      }, {
        'list': 'bullet'
      }] // Botões de lista ordenada e lista de marcadores
    ];
    var quillHow = new Quill('#how', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Descreva como será feito...'
    });
    var quillWhy = new Quill('#why', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Explique por que será feito...'
    });
  });

  function defineResponsible() {
    document.getElementById('responsibleSection').style.display = 'block';
  }

  function continueToDetails() {
    document.getElementById('actionDetails').style.display = 'block';
  }

  function finishActionPlan() {
    var what = document.getElementById('what').value;
    var who = document.getElementById('who').value;
	var whenElement = document.getElementById('when');
    var when = whenElement.value ? new Date(whenElement.value + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem prazo definido';
    var where = document.getElementById('where').value;
    var how = document.querySelector('#how .ql-editor').innerHTML;
    var why = document.querySelector('#why .ql-editor').innerHTML;
    var costValue = parseFloat(document.getElementById('cost').value.replace(/[^\d.-]/g, '')); // Extrair apenas os números do valor
    var cost = formatCurrency(costValue); // Formatar o valor como moeda
    // Verifica se o campo de custo está vazio
    if (isNaN(costValue) || costValue === 0) {
      cost = 'Sem custos';
    }

    var cardContent = `
    <div class="action-card relative" style="animation: customAni 0.5s ease;">
        <div class="highlight">${what}</div>
        <div><strong>Responsável:</strong> ${who}</div>
        <div><strong>Quando?</strong> ${when}</div>
        <div><strong>Onde?</strong> ${where}</div>
        <div><strong>Como será feito?</strong> ${how}</div>
        <div><strong>Por que será feito?</strong> ${why}</div>
        <div><strong>Quanto irá custar?</strong> ${cost}</div>
        <img src="PlanestitP.png" alt="Imagem dentro do card" class="absolute bottom-0 right-0 w-12 h-auto border-none rounded corner-image">
    </div>
`;
	  
    // Cria um novo elemento div para o card de ação
    var newCard = document.createElement('div');
    newCard.classList.add('action-card'); // Adiciona a classe 'action-card' ao novo card
    newCard.innerHTML = cardContent; // Define o conteúdo do novo card
    // Adiciona o novo card à div de container de cards
    var actionCardContainer = document.getElementById('actionCardContainer');
    actionCardContainer.appendChild(newCard);
    // Aplica a animação ao novo card apenas
    // Cria os botões "Baixar" e "Excluir" para o novo card
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-container');

   var downloadButton = document.createElement('button');
   var downloadImage = document.createElement('img');
   downloadImage.src = 'download.png'; // Substitua 'caminho/para/download.png' pelo caminho correto
   downloadImage.alt = 'Baixar';
   downloadButton.appendChild(downloadImage);
   downloadButton.classList.add('btn-download');
   downloadButton.onclick = function() {
      downloadActionPlan(newCard); // Chama a função downloadActionPlan() passando o elemento do card
   };

    var deleteButton = document.createElement('button');
    var deleteImage = document.createElement('img');
    deleteImage.src = 'excluir.png'; // Substitua 'caminho/para/excluir.png' pelo caminho correto
    deleteImage.alt = 'Excluir';
    deleteButton.appendChild(deleteImage);
    deleteButton.classList.add('btn-delete');
    deleteButton.onclick = function() {
    deleteActionPlan(newCard, buttonContainer);
   };
    // Adiciona os botões ao final do card
    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(deleteButton);
    actionCardContainer.appendChild(buttonContainer);
    resetForm(); // Limpa o formulário
  }

  function resetForm() {
    document.getElementById('what').value = '';
    document.getElementById('who').value = '';
    document.getElementById('when').value = '';
    document.getElementById('where').value = '';
    document.querySelector('#how .ql-editor').innerHTML = '';
    document.querySelector('#why .ql-editor').innerHTML = '';
    document.getElementById('cost').value = '';
    document.getElementById('responsibleSection').style.display = 'none';
    document.getElementById('actionDetails').style.display = 'none';
  }

  function clearActionCards() {
    var actionCardContainer = document.getElementById('actionCardContainer');
    actionCardContainer.innerHTML = ''; // Remove todos os cards de ação
  }

  function deleteActionPlan(cardElement, buttonContainer) {
    cardElement.classList.add('fadeOut'); // Adiciona a classe para animação de fadeOut
    setTimeout(function() {
      cardElement.remove(); // Remove o card do DOM
      buttonContainer.remove(); // Remove os botões do DOM
	  notifyDelete(); // Exibir mensagem de notificação
    }, 300); // Tempo de espera igual à duração da animação (300ms)
  }
  
  // Função para exibir mensagem de notificação ao excluir um card
function notifyDelete() {
  alert('O card foi excluído com sucesso!');
}

  // Função para formatar um número como moeda (R$)
  function formatCurrency(value) {
    return 'R$ ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Adiciona separadores de milhares e formata duas casas decimais
  }
  // Função para redimensionar automaticamente a área de texto à medida que o usuário digita
  function autoResize(textarea) {
    textarea.style.height = 'auto'; // Redefine a altura para auto para que o navegador calcule a altura correta
    textarea.style.height = textarea.scrollHeight + 'px'; // Define a altura com base no conteúdo
  }
  
  // Função para baixar o card como imagem JPG
   function downloadActionPlan(cardElement) {
     domtoimage.toJpeg(cardElement)
    .then(function (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      const whatElement = cardElement.querySelector('.highlight');
      const whatText = whatElement.textContent.trim();
      link.download = `${whatText}.jpg`; // Alterando a extensão para .jpg
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notifyDownload(); // Exibe mensagem de notificação após o download bem-sucedido
    })
    }

    // Função para exibir mensagem de notificação ao baixar um card
    function notifyDownload() {
      alert('O card foi baixado com sucesso!');
    }
