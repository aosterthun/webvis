import sys

import scrapy
#from scrapy.linkextractors import LinkExtractor


class QuotesSpider(scrapy.Spider):
    name = "quotes"

    def __init__(self):
        self.current_depth = 0
        self.maximum_depth = 2
        #self.link_extractor = LinkExtractor(uinque = True)

    def start_requests(self):
        urls = [
            'http://hyperlink.cool',
            #'http://quotes.toscrape.com/page/1/',
        ]

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        print("Parsing links for url " + str(response.url))

        links = response.css('a::attr(href)')
        hyperlinks = []
        for i in xrange(0,len(links)):
            hyperlink = response.urljoin(links[i].extract())
            hyperlinks.append(hyperlink)
            print(hyperlink)

        self.current_depth += 1

        if self.current_depth == self.maximum_depth:
            return
        else:
            for hyperlink in hyperlinks:
                yield scrapy.Request(hyperlink, callback=self.parse)