# kubernates-assignment
This assignment contains the Nodejs application which deployed on AWS Elastic Kubernates Service. As per the assignment the node application will return the timestamp and hostname of the pod after hitting the url. 

The AWS EKS service is created using ekctl command. The following blog is followed to create the EKS service.

https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html


### Login into ECR public repository 
First login into AWS public repository to push the docker image for deployement creation in EKS.
```
[ec2-user@ip-172-31-43-105 ~]$ aws ecr-public get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin public.ecr.aws/p6z1k167
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### Build Docker image
Change directory into nodeapp and execute the below command to run the docker image. 
```
sudo docker build -t nodeapp:1.0 .
```
### Verify docker images
```
[ec2-user@ip-172-31-43-105 ~]$ sudo docker images
REPOSITORY                           TAG         IMAGE ID       CREATED        SIZE
public.ecr.aws/p6z1k167/nodeapp      1.0         a485cec7d6f6   40 hours ago   114MB
nodeapp                              1.0         a485cec7d6f6   40 hours ago   114MB
node                                 16-alpine   b1ca7421d2e7   6 days ago     112MB
```

### Tag and Push docker image
Docker tag and push is used to push images into ECR public registry 

```
[ec2-user@ip-172-31-43-105 ~]$ sudo docker tag nodeapp:1.0 public.ecr.aws/p6z1k167/nodeapp:1.0

[ec2-user@ip-172-31-43-105 ~]$ sudo docker push public.ecr.aws/p6z1k167/nodeapp:1.0
The push refers to repository [public.ecr.aws/p6z1k167/nodeapp]
db93e2d9b1f9: Pushed 
de66896f030b: Pushed 
abfac3482920: Pushed 
a6bd4d31950d: Pushed 
69bca5427c67: Pushed 
e0731642d6ea: Pushed 
47033e75bc75: Pushed 
994393dc58e7: Pushed 
1.0: digest: sha256:cb39c9024fde4bcefe92bf1d04cadf9240a05a658adb6ac199103863a1233c20 size: 1990
```

## How to deploy the application in Kubernates
### 1. Create namespace in kubernates
Namespace is dedicated space or environment to deploy the application into kubernates. 
```
kubectl create ns app
namespace/app created
```
#### 2. Create Deployment of Application
In Kubernetes, a deployment is a method of launching a pod with containerized applications and ensuring that the necessary number of replicas is always running on the cluster.
```
[ec2-user@ip-172-31-43-105 ~]$ kubectl create deployment nodeapp --image=public.ecr.aws/p6z1k167/nodeapp:1.0 --namespace app
deployment.apps/nodeapp created
```

#### Verify deployments

```
kubectl get pods --namespace app
NAME                       READY   STATUS    RESTARTS   AGE
nodeapp-67b8f5bff7-gpdkm   1/1     Running   0          115s
```

### 3. Create service for pod interface
A service is responsible for exposing an interface to those pods, which enables network access from either within the cluster or between external processes and the service.
```
kubectl expose deployment nodeapp --port 3000 -n app 
service/nodeapp created
```

#### verify the created service
```
[ec2-user@ip-172-31-43-105 ~]$ kubectl get svc -n app
NAME      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
nodeapp   ClusterIP   10.100.69.139   <none>        3000/TCP   22h
```

### 4. Create ingress to access the traffic from outside world
AWS Load Balancer Controller used to create the ingress that helps to manage Elastic Load Balancers for a Kubernetes cluster. Create ingress.yaml file with aws lb class.
The following blog is used to configure the ALB

https://aws.amazon.com/premiumsupport/knowledge-center/eks-alb-ingress-aws-waf

``` 
kubectl create -f ingress.yaml
```

#### verify loadbalancer
```
[ec2-user@ip-172-31-43-105 ~]$ kubectl get ingress -n app
NAME      CLASS   HOSTS   ADDRESS                                                             PORTS   AGE
ingress   alb     *       k8s-app-ingress-cfa5f8ecd1-559609628.ap-south-1.elb.amazonaws.com   80      21h
```

## Create metrices
The Kubernetes Metrics Server is an aggregator of resource usage data in your cluster.The Metrics Server is also used by other Kubernetes add ons, such as the Horizontal Pod Autoscaler or the Kubernetes Dashboard. 
Deploy the Metrics Server with the following command.
```
kubectl apply -f components.yaml 
serviceaccount/metrics-server created
clusterrole.rbac.authorization.k8s.io/system:aggregated-metrics-reader created
clusterrole.rbac.authorization.k8s.io/system:metrics-server created
rolebinding.rbac.authorization.k8s.io/metrics-server-auth-reader created
clusterrolebinding.rbac.authorization.k8s.io/metrics-server:system:auth-delegator created
clusterrolebinding.rbac.authorization.k8s.io/system:metrics-server created
service/metrics-server created
deployment.apps/metrics-server created
apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io created
```

### Verify metrices applied or not
Verify that the metrics-server deployment is running the desired number of pods with the following command.
``` 
kubectl get deployment metrics-server -n kube-system
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
metrics-server   0/1     1            0           16s
```
### Check pod metrices
Once Metrics Server is deployed, we can query the Metrics API to retrieve current metrics from any node or pod using the below commands. 

```
kubectl top pods -n app
NAME                       CPU(cores)   MEMORY(bytes)   
nodeapp-67b8f5bff7-bc52n   1m           14Mi            
nodeapp-67b8f5bff7-gpdkm   1m           14Mi       
```
### Check node metrices
```
[ec2-user@ip-172-31-43-105 kubernates-assignment]$ kubectl top nodes -n app
NAME                                           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
ip-172-31-14-142.ap-south-1.compute.internal   60m          3%     598Mi           17%       
ip-172-31-20-160.ap-south-1.compute.internal   53m          2%     579Mi           17%    
```

### Verify the nodeapplication is returning the response or not 
Hit the application url in browser and verify the response of nodeapp service.
<kbd>
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/67383223/184795127-8a6d1fc1-b0ed-4b12-84a7-662600b8730e.png">
</kbd>
