/*jslint node: true */
"use strict";

module.exports = function(sequelize, DataTypes) {
	var Design = sequelize.define("Design", {
		canvasData: DataTypes.STRING,
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		}
	});

	return Design;
};