// Objetivo:
// Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

// Passos:
// 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
// 2. Obter o valor digitado pelo usuário no campo de texto.
// 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
// 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
// 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
// 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
//    - Mostrar o HTML gerado em uma área de preview.
//    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
// 7. Remover o indicador de carregamento após o recebimento da resposta.

function setLoading(isLoading) {
    const btnSpan = document.querySelector('#generate-btn')
    if (isLoading) {
        btnSpan.innerHTML = 'Gerando Novo Background...'
    } else {
        btnSpan.innerHTML = 'Gerar Background Mágico'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-group');
    const textArea = document.querySelector('#description');
    const htmlCode = document.querySelector('#html-code');
    const cssCode = document.querySelector('#css-code')
    const preview = document.querySelector('#preview-section')
    
    form.addEventListener('submit', async (event) => {
        // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
        event.preventDefault();
        // 2. Obter o valor digitado pelo usuário no campo de texto.
        const description = textArea.value.trim();

        if (!description) {
            return;
        }
        //3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
        setLoading(true);

        try {
            // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
            const response = await fetch('https://dbork.app.n8n.cloud/webhook/Fundo-Magico-SZPC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description })
            });
            
            // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
            const data = await response.json();            
            
            //6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
            //    - Mostrar o HTML gerado em uma área de preview.
            //    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
            htmlCode.textContent = data.code || "";
            cssCode.textContent = data.style || "";

            // reexibindo o preview
            preview.style.display = 'block';
            preview.innerHTML = data.code || "";

            let styleTag = document.getElementById("dynamic-style");

            if (styleTag) styleTag.remove();

            if (data.style) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-style';
                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }

        } catch (error) {
            // Caso der algum erro mostrar via console e colocar texto no preview indicando a falha
            console.error("Erro ao gerar o fundo: ", error);
            htmlCode.innerHTML = "Erro ao gerar codigo HTML, tente novamente"
            cssCode.innerHTML = "Erro ao gerar codigo CSS, tente novamente"
            preview.innerHTML = "";
        } finally {
            // 7. Remover o indicador de carregamento após o recebimento da resposta.
            setLoading(false);
        }
    })
})