//Datasets List is a list of rows from dataAdmin/models.Dataset table
const DatasetsList = JSON.parse(document.getElementById('datasets-list').innerHTML);
const currentPage = parseInt(document.getElementById('current-page').innerHTML);
const totalPages = parseInt(document.getElementById('total-pages').innerHTML);

function App(){
    return <div>
        <h1>Dataset App</h1>
        Datasets:
        <ol>
        {
            DatasetsList.map((dataset, index) => {
                return <li key={index}>
                    <a href={dataset.url}>{dataset.name} - {dataset.num_images} images</a>
                    <div>{dataset.description}</div>
                </li>
            })
        }
        </ol>

        Page {currentPage} out of {totalPages} pages
    </div>
}
export default App;