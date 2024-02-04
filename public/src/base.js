const api_tunnel = (function (){
    const apiTemplateString = `
    <div>
        <button class="api-row">
            <span class="api-method"></span>
            <div class="method-details">
                <span class="method-details--description"></span>
            </div>
        </button>
        <form> 
            <input>
            <button>Trigger</button>
        </form>
        <pre id="response"></pre>
    </div>
    `;
    const pathDescription = `<span class="method-details--description"></span>`;
    const template = document.createElement('template');

    loadApiEndpoints();

    // Fetch and display API endpoints
    async function loadApiEndpoints() {
        const response = await fetch('/apis/api-endpoints.json');
        const apiEndpoints = await response.json();
        const list = document.getElementById('apiList');
        createApiDom(apiEndpoints);
    }
    
    function createDomFromStrings(str){
        const template = document.createElement('template');
        template.innerHTML = sanitizeHtml(str);
        return template.content.cloneNode(true);
    }

    function createApiDom(data){
        const node = document.createRange().createContextualFragment(apiTemplateString);
        const template = document.createDocumentFragment();
        data.forEach(endpoint => {
            const templateMain = createDomFromStrings(apiTemplateString);
            const templateRow = templateMain.querySelector('.api-row');
            const templateRowBtm = templateMain.querySelector('.api-row+form>button');
            const templateMethod = templateMain.querySelector('.api-method');
            const templateMethodDetails = templateMain.querySelector('.method-details>span');
    
            
            templateMethod.textContent = `${endpoint.method}`;
            templateRowBtm.addEventListener('click', toggleInput);
            
            if(!!endpoint.parameter){
                templateMethodDetails.textContent = `${endpoint.path}/${endpoint.parameter}`;
            } else {
                templateMethodDetails.textContent = `${endpoint.path}`;
            }
    
            if(!!endpoint.description){
                const enpointDesc = createDomFromStrings(pathDescription).querySelector('.method-details--description');
                enpointDesc.textContent = `${endpoint.description}`;
                templateMethodDetails.appendChild(enpointDesc);
            }
    
            switch(endpoint.method) {
                case 'GET':
                    templateRow.classList.add('api-row--get');
                    templateMethod.classList.add('api-method--get');
                    break;
                case 'POST':
                    templateRow.classList.add('api-row--post');
                    templateMethod.classList.add('api-method--post');
                    break;
                case 'PUT':
                    templateRow.classList.add('api-row--put');
                    templateMethod.classList.add('api-method--put');
                    break;
                case 'DELETE':
                    templateRow.classList.add('api-row--delete');
                    templateMethod.classList.add('api-method--delete');
                    break;
                default:
                    console.log(`There was no color matching found for ${color}.`);
            }
    
            template.appendChild(templateMain);
            document.querySelector('#apiList').appendChild(templateMain);
        });
    
        document.querySelector('#apiList').appendChild(template);
    }

    function sanitizeHtml(htmlString) {
        // Remove script tags and their content
        htmlString = htmlString.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    
        // Remove event handlers from tags
        htmlString = htmlString.replace(/ on\w+="[^"]*"/g, '');
    
        // Remove javascript: from href and action attributes
        htmlString = htmlString.replace(/(href|action)="javascript:[^"]*"/g, '');
    
        return htmlString;
    }

    function toggleInput(e){
        e.preventDefault();

        console.log('---------------------- fetch data',
         e,
         e.target.parentElement.querySelector('input').value,
         e.target.parentElement.parentElement.querySelector('.api-method').textContent.trim(),
         e.target.parentElement.parentElement.querySelector('.method-details--description').textContent.trim(),
         );
        console.dir(e.target.parentElement.parentElement.querySelector('.method-details--description').textContent.trim());
    }
}(window.apiTunnel = window.apiTunnel || {} ));