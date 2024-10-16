import React, { memo } from "react";

import s from "./NotFound.module.sass";
import cx from "classnames";

const NotFoundPage = () => {
	return (
		<div className={cx(s["not-found-page"], "wrapper")}>
			<div className={s.info}>
				<h2 className={s["not-found-page__title"]}>404</h2>
				<h2 className={s["not-found-page__info"]}>Not Found</h2>
				<p className={s["not-found-page__info"]}>
					Could not find requested resource
				</p>
			</div>
		</div>
	);
};

export default memo(NotFoundPage);
