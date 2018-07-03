# HashTag daemon   
This automation will scan tags used on Instgram. It will start of list of prefixes, for example `[prague, food]` and using Instagram search API it will take a look at list of tag suggestions. So we will get something like `[prague5, prague2017, pragueIsAwesome]` for the `prague` keyword. After that, we will repeate the process for each of these to find out even more specific hashtags.

In database we will store:
```
{
    "tag": "prague"
    "scantime": "foo",
    "usecount": 4201337
}
```


# Use case
The db will be utilized by frontend app for tag reccomendation. Let's say you are someone drawing webtoons on instagram about relationships. You'll feed few general keywords to the app, maybe: relationship, cartoon, drawing, cute, funny, love. Second thing you'll put in is size of your instagram account / some sort of average engagement / average number of likes. Based off that you will get recomended list of tags prefixed by the keywords you specified. Additionally combinations of keywords could be explored.

In case the app gets requests, we can save up those unknown tags as prefixes to be scanned.

Requirement on DB is that I need to be able to quickly retrieve be any of the attributes 
- most commonly, the query will go along lines of "find 5 random records prefixed with `prague` having between `500000` - `200000` uses"

Simply indexing everything should be absolutely sufficient for starter.


#Tag discovery
Here's a thing. 
- For prefix `a` you'll get returned nothing from instagram API. 
- For prefix `my` you get `myjob` but not get `myjoy`, and nothing from `myj*` except for `myjob`. 
That'se because there's so many words prefixed with `my`, only `myjob` makes it out of `myjob`. Once we get deeper, 
to longer prefixes, like `myjob`, there's nto as many hastags anymore - yet, we'll still miss some. For example `myjob` gets us `myjobdoesntsuck` but will not get us `myjobdoesnotsuck`.

Hence, it would make sense start of from set of roottags covering first two or three letter combinations `jo`, `ak`, `pre`. From this we get back some pretty major, widly used hashtags. 
Then we can expand our prefixes, but extracting prefixes from the found hastags. So if we get `myjobdoesntsuck`, we can try to explore its prefix `myjobd`. The question how deep we should keep doing this. Should also try to scan `myjobdo` ? Probably not in this case, cause we will only get small trashtags.  


#Tag database
The datastructure holding tags should be as simple ass possible, so that it's easy to enhance prefix scanning algorithm easily.