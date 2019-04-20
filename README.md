# serverless-methods

[![Greenkeeper badge](https://badges.greenkeeper.io/ITcutives/serverless-methods.svg)](https://greenkeeper.io/)

## Endpoints Supported

### HEAD

- not implemented

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

- not implemented

### PUT

- create/update object

### PATCH

- not implemented

### DELETE

- delete is only allowed for one resource object at a time.

## Required Project Structure

- Application ROOT 
    - security
    - models
    - schema
