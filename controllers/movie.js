/* 
Student id: 301145311
Student name: Sohyeon Song
*/

// create a reference to the model
let Movie = require('../models/movie');

// Gets all movies from the Database and renders the page to list all movies.
module.exports.movieList = function(req, res, next) {  
    Movie.find((err, movieList) => {
        // console.log(movieList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('movie/list', {
                title: 'Movie List', 
                movies: movieList
            })            
        }
    });
}

// Gets a movie by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;

    Movie.findById(id, (err, movieToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('movie/details', {
                title: 'Movie Details', 
                movie: movieToShow
            })
        }
    });
}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {

    let newMovie = Movie();

    res.render('movie/add_edit', {
        title: 'Add Movie',
        movie: newMovie,
        displayList: req.user ? req.user.displayList : ''})    

}

// Processes the data submitted from the Add form to create a new movie
module.exports.processAddPage = (req, res, next) => {
    let newMovie = Movie({
        Title : req.body.title,
        Synopsis: req.body.Synopsis,
        Year : req.body.Year,
        Director : req.body.Director,
        Genre : req.body.genre
        });

        Movie.create(newMovie, (err, movie) => {
            if(err)
            {
                console.log(err);
                res.end(err);
            }
            else{
                //refresh the movie list
                res.redirect('/movie/list');
            }
        });
}

// Gets a movie by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = (req, res, next) => {
 let id = req.params.id;

 Movie.findById(id, (err, movieToEdit) =>{
     if(err)
     {
         console.log(err);
         res.end(err);
     }
     else{
         res.render('movie/add_edit',{
             title: 'Edit Movie', 
             movie : movieToEdit,
            displayList :req.user ? req.user.displayList : ''})
     }
 });

}

// Processes the data submitted from the Edit form to update a movie
module.exports.processEditPage = (req, res, next) => {
    
    let id = req.params.id

   let editMovie = Movie({
       _id : id,
       Title:req.body.title,
       Synopsis: req.body.Synopsis,
       Year : req.body.Year,
       Director : req.body.Director,
       Genre : req.body.genre

   });

   Movie.editOne({_id: id}, editMovie,(err) => {
       if(err)
       {
           console.log(err);
           res.end(err);
       }
       else{
           res.redirect('/movie/list');
       }
   });
    
}

// Deletes a movie based on its id.
module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Movie.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else{
            //refresh the movie list
            res.redirect('movie/list');
        }
    });

}