I am old enough to have used CORBA, and COM+. Lucky enough to be building distributed loosely coupled systems for 20 years. Now witnessing how easy and accessible distributed technology have become. Many of the principles have not changed, but reflecting on my experience with modern cloud native architecture that building resilient and scalable system with PaaS cloud platforms is much cheaper than both on premises or monolithic IaaS. The on demand, pay for use model costs fractions of provisioned infrastructure, not only money, but also time. 

In a previous project I joined the team right after moving the infrastructure to AWS, and the team was using nothing but EC2, and VPCs. The cloud services from AWS enabled us to move incrementally to modernize the system with controlled risk. 

CloudFormation was the first service we used from the AWS stack of services. At the beginning we did not have a good idea of what we were doing, but AWS had a selection of useful templates to use and it gave us a taste of what we can accomplish. After a short while we managed to automate and codify our infrastructure creation. With our infrastructure as code we managed to evolve it incrementally for high availability with multi region infrastructure. CloudWatch events was then used to automate the response to failure events. The end result was a self healing environment with no extra cost. The outcome encouraged us to use more services. 

**Core or Meta** 

The next decision was whether to continue with meta services i.e. services that help manage and operate our existing code, or use the platform services. The advantages of AWS Lambda was intriguing, so intriguing to the point we were carefully looking for the catch and found none. We used some lambda services to automate some operation tasks, and it cost nothing, easy to manage and deploy so we decided to implement some new requirements using API Gateway, Lambda, RDS, SQS, and Beanstalk. 

The legacy component was wrapped into a Beanstalk deployment. Beanstalk enabled us to have a self healing, auto scaled instances without modifying the original code. The legacy code was wrapped with a proxy that listens to an SQS queue. The client communicated via a API gateway endpoints. The gateway handled authentication, throttling, key management, and HTTPS. The API gateway invoked a lambda function that implemented the product new functionality, then put a message in the SQS for the legacy processing. The SQS queue enabled us to control the throughput, tolerate failures, and auto scale the beanstalk environment based on the queue requests. The whole environment was deployed via a CLoudFormation template, and logs were collected via CloudWatch. The following diagram shows the general system architecture. 
![patterns taxonomy]({{ site.url }}/assets/media/Lambda_andBeanstalk.png)

**More for Less** 

The success of the project left us hungry for more. After coping with cold start time of lambda, the low cost and auto scaling encouraged us to use it more, and the reliability of SQS enabled resilient architecture at negligible cost. 

We added more services to the next project. Combined SNS/SQS to implement a pub/sub architecture. Decomposed more of the legacy logic into lambda functions. Started using DynamoDB for data persistence, and CodeDeploy for continuous delivery. 

**Goodbye CloudFormation and Welcome CDK** 

The CloudFormation template grew substantially and it was painful to maintain. We decided to look at AWS Cloud Deployment Kit CDK, and we never looked back. 

Out of the box CDK saves a considerable amount of code by following an opinionated CloudFormation code generation that follows AWS best practices. But also it allowed us to build custom constructs, that reflects our architectural patterns, and manipulate the constructs before generation to implement cross cutting concerns like adding monitoring support for our Pub/Sub endpoints. 

After implementing two new projects we were happily surprised that the production usage of the Lambda services was still covered by the free tier as well as DynamoDB deployments. 

The low cost meant that we can have sandboxed environments for individual developers or specific features. Also performing a production like tests on the staging environment without worrying about the bill. CDK and CodeDeploy allowed us to automate all these operations, and sleep happily at night.