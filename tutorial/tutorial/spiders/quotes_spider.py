import sys

import scrapy
#from scrapy.linkextractors import LinkExtractor

'''
  <a class="guide-item yt-uix-sessionlink yt-valign spf-link    "
    href="/channel/UCckETVOT59aYw80B36aP9vw"
    title="Matthias Wandel"
    data-sessionlink="ei=xxiTWdCYKMfS1gKe8ILwCw&amp;feature=g-channel&amp;ved=CKcCELUsGFciEwiQmPKmzNnVAhVHqVUKHR64AL4omxw" data-visibility-tracking="" data-external-id="UCckETVOT59aYw80B36aP9vw" data-serialized-endpoint="0qDduQEaEhhVQ2NrRVRWT1Q1OWFZdzgwQjM2YVA5dnc%3D"
  >

'''

class QuotesSpider(scrapy.Spider):
    name = "quotes"

    def __init__(self):
        self.current_depth = 0
        self.maximum_depth = 2
        #self.link_extractor = LinkExtractor(uinque = True)

    def start_requests(self):
        urls = [
            "https://www.youtube.com/user/lookslikeLink/channels"
            #'http://quotes.toscrape.com/page/1/',
        ]

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        print("Extracting channels for url " + str(response.url))

        channels = self.extract_channels(response)

        self.print_channels(channels)


        if self.current_depth == self.maximum_depth:
            return
        else:
            for name in channels:
                hyperlink = channels[name] + "/channels"
                print("Start new scrape for url " +  hyperlink)
                yield scrapy.Request(hyperlink, callback=self.parse)

            self.current_depth += 1

    def extract_channels(self, RESPONSE):
        previews = RESPONSE.css('div.yt-lockup-content')

        if previews != None:
            channels = dict()

            for preview in previews:
                title = None
                url = None

                title = preview.css('a::attr(title)').extract_first()
                url = preview.css('a::attr(href)').extract_first()

                if title != None and url != None:

                    title = str(title.encode("utf-8", "ignore"))
                    url = str(RESPONSE.urljoin(url))
                    channels[title] = url

            return channels
        else:
            return None

    def print_channels(self, CHANNELS):
        length = 0
        for name in CHANNELS:
            if len(name) > length:
                length = len(name)
        if length > 40:
            length = 20

        form = '{:>' + str(length) + '}'
        for name in CHANNELS:
            hyperlink = CHANNELS[name]
            print( form.format(name) + " -> " + hyperlink)