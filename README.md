# serverless-methods

[![Greenkeeper badge](https://badges.greenkeeper.io/ITcutives/serverless-methods.svg)](https://greenkeeper.io/)

## Endpoints Supported

### HEAD

### GET

#### QueryString

  - fields
    
    - example: `?fields=id,message.subject,receiver`
    
  - ordering 
  
    - example: `?sort=-created,title` 
    
        - createdAt: desc, and title: asc
    
  - page
  
    - example: `?page[number]=1&page[size]=1000`
 
  - filter
  
    - example: `'filter=' + encodeURIComponent('[{"field":"status","operator":"in","value":["delivered"]}]')`

### POST

### PUT

### PATCH

### DELETE


## Required Project Structure

- Application ROOT 
    - security
    - models
    - schema
