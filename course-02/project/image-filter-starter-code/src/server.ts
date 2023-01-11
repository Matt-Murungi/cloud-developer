import express from 'express';
import bodyParser from 'body-parser';
import {isUri} from 'valid-url';
import {filterImageFromURL, deleteLocalFiles, getAllLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async(req, res)=>{
    let imageUrl = req.query.image_url
    if(!isUri(imageUrl)){
      return res.status(400).send({error: "invalid image url"});
    }
    try{
      var filteredImage = await filterImageFromURL(imageUrl)
      res.sendFile(filteredImage, async (err)=>{
        if(!err){
          var allLocalFiles = await getAllLocalFiles()
          if (allLocalFiles.length !== 0) {
            console.log("all files", allLocalFiles)
            await deleteLocalFiles(allLocalFiles)
          }
        } else{
          console.log("error ", err.message)
          res.send({err})
        }
      })

    }catch(e){
      res.send({e})
    }




  })

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user

  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();