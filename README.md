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


