// CONSTANTS

export const CREDENTIALS = 'include'; // for AWS/docker
// export const CREDENTIALS = 'omit'; // for netlify/local

// export const BASE_URL = 'https://cime.caleydoapp.org'; // for netlify
// export const BASE_URL = 'http://127.0.0.1:8080'; // for local
export const BASE_URL = ''; // for AWS/docker



var smiles_cache = {}
var smiles_highlight_cache = {}

function handleSmilesCache(smiles:string, highlight=false){
    //already downloaded this image -> saved in smiles cache
    if(highlight){
        return smiles_highlight_cache[smiles];
    }else{
        return smiles_cache[smiles];
    }

}

function setSmilesCache(smiles, highlight=false, data){
    if(highlight)
        smiles_highlight_cache[smiles] = data;
    else
        smiles_cache[smiles] = data;
}

async function async_cache(cached_data){
    return cached_data;
}

var cache = {}
function handleCache(key){
    if(cache[key])
        return Object.assign(cache[key]); // return copy of cached object
    return null;
}

function setCache(key, value){
    cache[key] = value;
}


function handle_errors(response){
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
function handle_errors_json(data){
    if(Object.keys(data).includes("error")){
        alert(data["error"]);
    }
    return data;
}


export async function delete_file(filename){
    let path = BASE_URL+'/delete_file/' + filename;
    
    return fetch(path, {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .catch(error => {
        alert("file could not be deleted. please, try again");
        console.log(error);
    });
}

export async function get_uploaded_files(){
    
    let path = BASE_URL+'/get_uploaded_files_list';
    
    return fetch(path, {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .catch(error => {
        // alert("could not load uploaded filenames.")
        console.log(error);
    });
}

export async function get_difference_highlight(smilesA:any, smilesB:any, controller=null) {
    
    const formData = new FormData();
    formData.append('smilesA', smilesA);
    formData.append('smilesB', smilesB);

    let path = BASE_URL+'/get_difference_highlight';
    let my_fetch = null;
    if(controller){
        my_fetch = fetch(path, {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
            signal: controller.signal
        })
    }else{
        my_fetch = fetch(path, {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
        })
    }

    return my_fetch
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        console.log(data)
        return data["data"];
    })
    .catch(error => {
        // alert("could not load structure");
        console.log(error)
    });
}


export async function get_structure_from_smiles(smiles:string, highlight=false, controller=null) {
    const cached_data = handleSmilesCache(smiles, highlight)
    if(cached_data){
        return async_cache(cached_data);
    }

    const formData = new FormData();
    formData.append('smiles', smiles);
    if(localStorage.getItem("unique_filename"))
        formData.append('filename', localStorage.getItem("unique_filename"));

    let path = BASE_URL+'/get_mol_img';
    if(highlight){
        path += "/highlight";
    }

    let my_fetch = null;
    if(controller){
        my_fetch = fetch(path, {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
            signal: controller.signal
        })
    }else{
        my_fetch = fetch(path, {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
        })
    }

    return my_fetch
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        setSmilesCache(smiles, highlight, data["data"]);
        return data["data"];
    })
    .catch(error => {
        // alert("could not load structure");
        console.log(error)
    });
}

export async function get_structures_from_smiles_list(formData:FormData, controller?){
    if(localStorage.getItem("unique_filename"))
        formData.append('filename', localStorage.getItem("unique_filename"));

    let my_fetch = null;
    if(controller){
        my_fetch = fetch(BASE_URL+'/get_mol_imgs', {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
            signal: controller?.signal
        })
    }else{
        my_fetch = fetch(BASE_URL+'/get_mol_imgs', {
            method: 'POST',
            body: formData,
            credentials: CREDENTIALS,
        })
    }
    return my_fetch
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        if(data["error_smiles"].length > 0){
            alert("following smiles couldn not be parsed: " + data["error_smiles"]);
        }
        return data;
    })
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            alert("could not load structures");
            console.log(error)
        }
    });
}


export async function get_mcs_from_smiles_list(formData:FormData, controller?) {
    
    let my_fetch = null;
    if(controller){
        my_fetch = fetch(BASE_URL+'/get_common_mol_img', {
            method: 'POST',
            body: formData,
            signal: controller?.signal
        })
    }else{
        my_fetch = fetch(BASE_URL+'/get_common_mol_img', {
            method: 'POST',
            body: formData,
        })
    }
    return my_fetch
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(response => response["data"])
    .catch(error => {
        // alert("could not get maximum common substructure")
        console.log(error)
    });
    
}

export async function get_substructure_count(smiles_list, filter) {
    const formData = new FormData();
    formData.append('smiles_list', smiles_list);
    formData.append('filter_smiles', filter);
    return fetch(BASE_URL+'/get_substructure_count', {
        method: 'POST',
        body: formData,
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        if(Object.keys(data).includes("substructure_counts"))
            return data["substructure_counts"];
        else 
            throw Error("Backend responded with error: " + data["error"]);
    })
    .catch(error => {
        alert("could not find substructure match")
        console.log(error)
    });
    
}


export async function upload_sdf_file(file, controller?){
    // upload the sdf file to the server
    // the response is a unique filename that can be used to make further requests
    const formData_file = new FormData();
    formData_file.append('myFile', file);
    formData_file.append('file_size', file.size);
    
    const promise = fetch(BASE_URL+'/upload_sdf', {
        method: 'POST',
        body: formData_file,
        credentials: CREDENTIALS,
        signal: controller?.signal
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        localStorage.setItem("unique_filename", data["unique_filename"]);
    })
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            alert("error when uploading file. it might be too big");
            console.log(error);
        }
    });
    return promise;
}


export async function get_representation_list(refresh=false, dataset_name="", controller:AbortController=null){
    if(!refresh){
        const cached_data = handleCache("representation_list_" + dataset_name)
        if(cached_data && cached_data["rep_list"].length > 0){
            return async_cache(cached_data);
        }
    }
    let path = BASE_URL+'/get_atom_rep_list';
    if(localStorage.getItem("unique_filename"))
        path += "/" + localStorage.getItem("unique_filename");


    let my_fetch = null;
    if(controller){
        my_fetch = fetch(path, {
            method: 'GET',
            credentials: CREDENTIALS,
            signal: controller.signal
        })
    }else{
        my_fetch = fetch(path, {
            method: 'GET',
            credentials: CREDENTIALS
        })
    }


    return my_fetch
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .then(data => {
        setCache("representation_list_" + dataset_name, data);
        return data;
    })
    .catch(error => {
        // alert("error when loading representation list")
        console.log(error)
    });
}





export async function calculate_hdbscan_clusters(X, min_cluster_size, min_cluster_samples, allow_single_cluster){

    const formData = new FormData();
    formData.append('min_cluster_size', min_cluster_size);
    formData.append('min_cluster_samples', min_cluster_samples);
    formData.append('allow_single_cluster', allow_single_cluster);
    formData.append('X', X);
    return fetch(BASE_URL+'/segmentation', {
        method: 'POST',
        body: formData
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(handle_errors_json)
    .catch(error => {
        alert("error when calculating clusters")
        console.log(error)
    });
}


