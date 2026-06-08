# Dataset_Analyser
Abstract:
	Problem Statement:
		-Many softwares now-a-days can do dataset analysis by just typing the programming statements and then even do the plotting. 
		-but it doesn't provide a dynamic engagement of what is does, like after finding skewness, it pops a message 'right skew'
		-also it doesn't have a flow to it, like inputing the dataset, we have to manually split the data and perform loocv on every observation
		-have to find everything about the dataset procedurally, will sometimes miss some steps like not finding outliers until later
	Objectives:
		-to create a software model, using build-in functions we will create a program that gives some small messages and all 			characteristics of the dataset in single instance. then,
		-analyse the dataset,use exploratory data analysis and find outliers, output residual plots to analyse assumptions of 			linear regression
		-create a regression model and use loocv test and split to make a effective model and use error metrics to find the best 		model for the training sample, then validate the model on a testing set. 
		-save the model algorithm parameters and use it to test other samples of another dataset of similar kind, then improve the 		model on em too
		-Also to use a naive bayes classifier algorithm to classify categories