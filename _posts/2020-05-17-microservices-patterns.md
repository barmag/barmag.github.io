---
layout: page
title:  "Microservices Patterns Chapter 1 Notes"
date:   2020-05-17 12:50:48 +0200
categories: readings
---
Microservices Patterns

Sunday, May 17, 2020

10:24 PM

 
This is my personal notes for **"Microservices Patterns"** book by Chris Richardson [<span class="underline">https://microservices.io/book</span>](https://microservices.io/book)


## Chapter 1

The first section of this chapter covers the monolithic hell and makes the case of Microservices with a story about a fictitious company and its struggle with maintaining and growing a monolithic app.

I found this section to be verbose with shallow information. I think it is fair to say if you are reading a book about Microservices Patterns chances are you are familiar with the drawbacks of monolithic apps vs. Microservices. It is safe to skip this section in my opinion.

Section 1.2, and 1.3 are about the book and why it is relevant and what it covers. Read it maybe before buying it to decide if it is relevant.

Section 1.4 defines Microservices. I think at the time of writing the book Chris Richardson did not have a concrete definition so instead he presented a verbose description. I find his definition on [<span class="underline">https://microservices.io/</span>](https://microservices.io/) to be more concrete. What I like about his definition is removing the size of the codebase as a Microservice characteristic and associating the size with team instead. I find this very useful as he drills down to the organizational change needed to decompose the monolith.

Generally, I prefer Sam Newman's definition of Microservices.

[<span class="underline">Principles Of Microservices by Sam Newman</span>](https://www.youtube.com/watch?v=PFQnNFe27kU)

Sam Newman's definition: Small (independently releasable) **Autonomous services that** work together, modelled around a business domain

[<span class="underline">Microservices and Serverless - Sam Newman</span>](https://www.youtube.com/watch?v=CKLIL3Kbf60)

**Independently deployable** services that **work together**, modelled around a **business domain**

Section 1.6 is the most informative in this chapter, and specifically 1.6.3. It gives an overview of the pattern language used in the book and gives an excellent taxonomy of the patterns.

Chris classifies the patterns into three main layers. Application, Application Infrastructure, and Infrastructure patterns.

![patterns taxonomy]({{ site.url }}/assets/media/image1.png)

*  **Application Patterns**
    * Decomposition
    * Database Architecture
    * Querying
    * Maintaining Data Consistency
    * Testing
* **Application Infrastructure Patterns**
    * Cross-cutting Concerns
    * Security
    * Transactional Messaging
    * Communication Style
    * Reliability
    * Observability
* **Infrastructure Patterns**
    * Deployment
    * Discovery
    * External API

**Chapter 2** describes decomposition patterns in details. Chris describes it as a set of strategies for decomposing an application into Microservices.

**Chapter 3** drills down into communication patterns including communication style, reliability, and transaction messaging while **Chapter 8** covers external API patterns.

**Chapter 4, 5, and 6** cover the strategies for data storage in the context of Microservices and the challenges associated with maintaining a database per service. Saga pattern is described in detail as an alternative to 2PC approach for distributed transactions.

Another challenge with database decomposition is querying data scattered around multiple services. **Chapter 7** details a set of different patterns for implementing queries.

**Chapter 12** focuses on deployment of Microservices either as VM, container, or serverless. While Chapter 11 details application observability patterns including health check API, log aggregation, distributed tracing, exception tracking, application metrics, and audit logging. **Chapter 11** also describes Microservices Chassis pattern for handling cross-cutting concerns like observability and discovery. **Chapter 11** also discusses security, and access token pattern in detail.

**Chapter 9 and 10** focus on patterns for services automated testing with patterns for testing services in isolation with consumer-driven contract test, consumer-side contract test, and service component test.

The final section of this introductory chapter gives a good piece of wisdom about the non-technical aspect of implementing Microservices, and the need of organizational changes and consideration to the human side.

This chapter intrigued my interest in this book and looking forward to reading more.
